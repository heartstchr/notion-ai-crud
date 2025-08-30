// Talent Pool CRUD Operations
// Comprehensive CRUD operations for managing talent profiles in Notion

export const config = {
  method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

export default async function handler(request, context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new Response("", { status: 200, headers: corsHeaders });
  }

  const notionApiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionApiKey || !databaseId) {
    return new Response(
      JSON.stringify({ error: "Notion API key or Database ID missing" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const url = new URL(request.url);
  const method = request.method;
  const talentId = url.searchParams.get("id");

  try {
    switch (method) {
      case "GET":
        if (talentId) {
          // Get specific talent profile
          return await getTalentProfile(talentId, notionApiKey, corsHeaders);
        } else {
          // Get all talent profiles
          return await getAllTalentProfiles(
            databaseId,
            notionApiKey,
            corsHeaders,
            url.searchParams
          );
        }

      case "POST":
        // Create new talent profile
        const createData = await request.json();
        return await createTalentProfile(
          databaseId,
          createData,
          notionApiKey,
          corsHeaders
        );

      case "PUT":
        // Update talent profile
        if (!talentId) {
          throw new Error("Talent ID is required for updates");
        }
        const updateData = await request.json();
        return await updateTalentProfile(
          talentId,
          updateData,
          notionApiKey,
          corsHeaders
        );

      case "DELETE":
        // Delete (archive) talent profile
        if (!talentId) {
          throw new Error("Talent ID is required for deletion");
        }
        return await deleteTalentProfile(talentId, notionApiKey, corsHeaders);

      default:
        throw new Error(`Method ${method} not allowed`);
    }
  } catch (error) {
    console.error("Talent CRUD error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Operation failed",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

// Helper function to convert form data to Notion properties
function convertToNotionProperties(data) {
  const properties = {};

  Object.entries(data).forEach(([key, value]) => {
    if (!value || value === "") return; // Skip empty values

    // Handle different property types based on common field names and value patterns
    if (key.toLowerCase().includes("email")) {
      properties[key] = { email: value };
    } else if (key.toLowerCase().includes("phone")) {
      properties[key] = { phone_number: value };
    } else if (
      key.toLowerCase().includes("url") ||
      key.toLowerCase().includes("link") ||
      (typeof value === "string" &&
        (value.startsWith("http") || value.startsWith("www")))
    ) {
      properties[key] = { url: value };
    } else if (
      key.toLowerCase() === "name" ||
      key.toLowerCase().includes("title")
    ) {
      // Title property
      properties[key] = {
        title: [{ text: { content: value } }],
      };
    } else if (typeof value === "boolean") {
      properties[key] = { checkbox: value };
    } else if (typeof value === "number") {
      properties[key] = { number: value };
    } else if (Array.isArray(value)) {
      // Multi-select
      properties[key] = {
        multi_select: value.map((item) => ({ name: item })),
      };
    } else if (value && typeof value === "string" && value.includes(",")) {
      // Treat comma-separated values as multi-select
      const items = value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      properties[key] = {
        multi_select: items.map((item) => ({ name: item })),
      };
    } else {
      // Default to rich text
      properties[key] = {
        rich_text: [{ text: { content: String(value) } }],
      };
    }
  });

  return properties;
}

// Helper function to convert Notion properties to simple object
function convertFromNotionProperties(properties) {
  const result = {};

  Object.entries(properties).forEach(([key, property]) => {
    switch (property.type) {
      case "title":
        result[key] = property.title?.map((t) => t.plain_text).join("") || "";
        break;
      case "rich_text":
        result[key] =
          property.rich_text?.map((t) => t.plain_text).join("") || "";
        break;
      case "email":
        result[key] = property.email || "";
        break;
      case "phone_number":
        result[key] = property.phone_number || "";
        break;
      case "url":
        result[key] = property.url || "";
        break;
      case "select":
        result[key] = property.select?.name || "";
        break;
      case "multi_select":
        result[key] = property.multi_select?.map((s) => s.name) || [];
        break;
      case "checkbox":
        result[key] = property.checkbox || false;
        break;
      case "number":
        result[key] = property.number || 0;
        break;
      case "date":
        result[key] = property.date?.start || "";
        break;
      case "status":
        result[key] = property.status?.name || "";
        break;
      default:
        result[key] = "";
    }
  });

  return result;
}

// Get all talent profiles
async function getAllTalentProfiles(
  databaseId,
  notionApiKey,
  corsHeaders,
  searchParams
) {
  const page_size = parseInt(searchParams.get("page_size")) || 100;
  const start_cursor = searchParams.get("start_cursor");

  const body = {
    page_size,
    filter: {
      property: "archived",
      checkbox: {
        equals: false,
      },
    },
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
  };

  if (start_cursor) {
    body.start_cursor = start_cursor;
  }

  const response = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const data = await response.json();

  const profiles = data.results.map((page) => ({
    id: page.id,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    ...convertFromNotionProperties(page.properties),
  }));

  return new Response(
    JSON.stringify({
      success: true,
      results: profiles,
      has_more: data.has_more,
      next_cursor: data.next_cursor,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Get specific talent profile
async function getTalentProfile(talentId, notionApiKey, corsHeaders) {
  const response = await fetch(`https://api.notion.com/v1/pages/${talentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Notion-Version": "2022-06-28",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const page = await response.json();

  const profile = {
    id: page.id,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    ...convertFromNotionProperties(page.properties),
  };

  return new Response(
    JSON.stringify({
      success: true,
      result: profile,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Create new talent profile
async function createTalentProfile(
  databaseId,
  data,
  notionApiKey,
  corsHeaders
) {
  const properties = convertToNotionProperties(data);

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const page = await response.json();

  const profile = {
    id: page.id,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    ...convertFromNotionProperties(page.properties),
  };

  return new Response(
    JSON.stringify({
      success: true,
      result: profile,
      message: "Talent profile created successfully",
    }),
    {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Update talent profile
async function updateTalentProfile(talentId, data, notionApiKey, corsHeaders) {
  const properties = convertToNotionProperties(data);

  const response = await fetch(`https://api.notion.com/v1/pages/${talentId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const page = await response.json();

  const profile = {
    id: page.id,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    ...convertFromNotionProperties(page.properties),
  };

  return new Response(
    JSON.stringify({
      success: true,
      result: profile,
      message: "Talent profile updated successfully",
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Delete (archive) talent profile
async function deleteTalentProfile(talentId, notionApiKey, corsHeaders) {
  const response = await fetch(`https://api.notion.com/v1/pages/${talentId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ archived: true }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Talent profile deleted successfully",
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}
