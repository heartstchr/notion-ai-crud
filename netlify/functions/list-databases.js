// List Notion databases under NOTION_PARENT_PAGE_ID

const NOTION_API_VERSION = "2025-09-03";
const NOTION_BASE_URL = "https://api.notion.com/v1";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const notionApiKey = process.env.NOTION_API_KEY;
  const parentPageId = process.env.NOTION_PARENT_PAGE_ID;

  if (!notionApiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "NOTION_API_KEY is not configured" }),
    };
  }

  if (!parentPageId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "NOTION_PARENT_PAGE_ID is not configured",
      }),
    };
  }

  try {
    // Fallback approach: list child blocks of the parent page and collect child_database blocks
    let results = [];
    let nextCursor = undefined;
    do {
      const childrenRes = await fetch(
        `${NOTION_BASE_URL}/blocks/${parentPageId}/children${
          nextCursor ? `?start_cursor=${encodeURIComponent(nextCursor)}` : ""
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${notionApiKey}`,
            "Notion-Version": NOTION_API_VERSION,
          },
        }
      );

      if (!childrenRes.ok) {
        const err = await childrenRes.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${childrenRes.status}`);
      }

      const children = await childrenRes.json();
      const childDatabases = (children.results || [])
        .filter((b) => b.type === "child_database" && b.child_database && b.id)
        .map((b) => ({ id: b.id, title: b.child_database.title }));

      results = results.concat(childDatabases);
      nextCursor = children.has_more ? children.next_cursor : undefined;
    } while (nextCursor);

    // Enrich each database with url/properties and data sources
    const enriched = [];
    for (const db of results) {
      try {
        const dbRes = await fetch(`${NOTION_BASE_URL}/databases/${db.id}`, {
          headers: {
            Authorization: `Bearer ${notionApiKey}`,
            "Notion-Version": NOTION_API_VERSION,
          },
        });
        if (dbRes.ok) {
          const dbJson = await dbRes.json();

          // Check if database has multiple data sources
          const hasMultipleDataSources =
            dbJson.data_sources && dbJson.data_sources.length > 1;

          const enrichedDb = {
            id: db.id,
            title:
              db.title ||
              (dbJson.title && dbJson.title[0] && dbJson.title[0].plain_text) ||
              "Untitled",
            url: dbJson.url,
            last_edited_time: dbJson.last_edited_time,
            created_time: dbJson.created_time,
            properties: Object.keys(dbJson.properties || {}),
            hasMultipleDataSources,
            dataSources: dbJson.data_sources || [],
            // For backward compatibility, if single data source, expose it as the main database
            ...(hasMultipleDataSources
              ? {}
              : {
                  // Single data source - maintain backward compatibility
                  dataSourceId: dbJson.data_sources?.[0]?.id || db.id,
                }),
          };

          enriched.push(enrichedDb);
        } else {
          enriched.push({ id: db.id, title: db.title || "Untitled" });
        }
      } catch {
        enriched.push({ id: db.id, title: db.title || "Untitled" });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: enriched.length,
        results: enriched,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to list databases",
        message: error.message,
      }),
    };
  }
}
