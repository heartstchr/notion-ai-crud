// Generic Notion CRUD Proxy Server
// Universal CRUD operations for any Notion database

export const config = {
  method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

// Constants
const NOTION_API_VERSION = "2022-06-28";
const NOTION_BASE_URL = "https://api.notion.com/v1";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

export default async function handler(request, context) {
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new Response("", { status: 200, headers: corsHeaders });
  }

  const notionApiKey = process.env.NOTION_API_KEY;

  const url = new URL(request.url);
  const method = request.method;
  const recordId = url.searchParams.get("id");
  const databaseId =
    url.searchParams.get("database_id") || process.env.NOTION_DATABASE_ID;

  if (!notionApiKey || !databaseId) {
    return createErrorResponse("Notion API key or Database ID missing", 500);
  }

  try {
    switch (method) {
      case "GET":
        if (recordId) {
          return await getRecord(recordId, notionApiKey);
        } else if (url.searchParams.get("info") === "true") {
          return await getDatabaseInfo(databaseId, notionApiKey);
        } else {
          return await getAllRecords(
            databaseId,
            notionApiKey,
            url.searchParams
          );
        }

      case "POST":
        const createData = await request.json();
        return await createRecord(databaseId, createData, notionApiKey);

      case "PUT":
        if (!recordId) {
          throw new Error("Record ID is required for updates");
        }
        const updateData = await request.json();
        return await updateRecord(recordId, updateData, notionApiKey);

      case "DELETE":
        if (!recordId) {
          throw new Error("Record ID is required for deletion");
        }
        return await deleteRecord(recordId, notionApiKey);

      default:
        throw new Error(`Method ${method} not allowed`);
    }
  } catch (error) {
    return createErrorResponse(error.message || "Operation failed", 500);
  }
}

// Helper function to create error responses
function createErrorResponse(message, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Helper function to create success responses
function createSuccessResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Helper function to make Notion API calls
async function makeNotionRequest(endpoint, options = {}, notionApiKey) {
  // Build request options properly
  const requestOptions = {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Notion-Version": NOTION_API_VERSION,
      ...options.headers,
    },
  };

  // Only add body for POST/PUT/PATCH requests
  if (
    options.body &&
    ["POST", "PUT", "PATCH"].includes(requestOptions.method)
  ) {
    requestOptions.body = options.body;
  }

  const response = await fetch(`${NOTION_BASE_URL}${endpoint}`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data;
}

// Get database information
async function getDatabaseInfo(databaseId, notionApiKey) {
  const database = await makeNotionRequest(
    `/databases/${databaseId}`,
    {},
    notionApiKey
  );

  return createSuccessResponse({
    success: true,
    database: database,
  });
}

// Get all records from database
async function getAllRecords(databaseId, notionApiKey, searchParams) {
  const page_size = parseInt(searchParams.get("page_size")) || 100;
  const start_cursor = searchParams.get("start_cursor");

  const body = { page_size };
  if (start_cursor) {
    body.start_cursor = start_cursor;
  }

  // Check for archived property and add filter if it exists
  try {
    const schema = await makeNotionRequest(
      `/databases/${databaseId}`,
      {},
      notionApiKey
    );
    if (schema.properties.archived) {
      body.filter = {
        property: "archived",
        checkbox: { equals: false },
      };
    }
  } catch (error) {
    // Silently proceed without filter if archived property check fails
  }

  const data = await makeNotionRequest(
    `/databases/${databaseId}/query`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    notionApiKey
  );

  return createSuccessResponse({
    success: true,
    results: data.results,
    has_more: data.has_more,
    next_cursor: data.next_cursor,
  });
}

// Get specific record
async function getRecord(recordId, notionApiKey) {
  const page = await makeNotionRequest(`/pages/${recordId}`, {}, notionApiKey);

  return createSuccessResponse({
    success: true,
    result: page,
  });
}

// Create new record
async function createRecord(databaseId, properties, notionApiKey) {
  const page = await makeNotionRequest(
    "/pages",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties,
      }),
    },
    notionApiKey
  );

  return createSuccessResponse(
    {
      success: true,
      result: page,
      message: "Record created successfully",
    },
    201
  );
}

// Update record
async function updateRecord(recordId, properties, notionApiKey) {
  const page = await makeNotionRequest(
    `/pages/${recordId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ properties }),
    },
    notionApiKey
  );

  return createSuccessResponse({
    success: true,
    result: page,
    message: "Record updated successfully",
  });
}

// Delete (archive) record
async function deleteRecord(recordId, notionApiKey) {
  await makeNotionRequest(
    `/pages/${recordId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    },
    notionApiKey
  );

  return createSuccessResponse({
    success: true,
    message: "Record deleted successfully",
  });
}
