// Get Notion Database Schema
// This function retrieves the database schema from Notion to dynamically generate forms

export const config = {
  method: ["GET", "OPTIONS"],
};

export default async function handler(request, context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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
      JSON.stringify({
        error: "Notion API key or Database ID missing",
        missingKey: !notionApiKey,
        missingDatabase: !databaseId,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Get database schema from Notion
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${notionApiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const database = await response.json();

    // Extract and format properties for frontend use
    const formattedProperties = {};

    Object.entries(database.properties).forEach(([key, property]) => {
      formattedProperties[key] = {
        id: property.id,
        name: key,
        type: property.type,
        required: false, // Notion doesn't have required fields in the same way
      };

      // Add type-specific configuration
      switch (property.type) {
        case "select":
          formattedProperties[key].options = property.select?.options || [];
          break;
        case "multi_select":
          formattedProperties[key].options =
            property.multi_select?.options || [];
          break;
        case "status":
          formattedProperties[key].options = property.status?.options || [];
          break;
        case "number":
          formattedProperties[key].format = property.number?.format || "number";
          break;
        case "date":
          formattedProperties[key].includeTime =
            property.date?.time_zone !== null;
          break;
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        database: {
          id: database.id,
          title: database.title?.[0]?.plain_text || "Talent Pool",
          properties: formattedProperties,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Get database schema error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to retrieve database schema",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}
