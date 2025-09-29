import { GoogleGenerativeAI } from "@google/generative-ai";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

export async function handler(event, context) {
  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { message, context: userContext } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try multiple models with fallback
    const models = ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"];
    let model = null;
    let lastError = null;

    for (const modelName of models) {
      try {
        model = genAI.getGenerativeModel({ model: modelName });
        break; // If we get here, the model is available
      } catch (error) {
        console.log(`Model ${modelName} not available, trying next...`);
        lastError = error;
        continue;
      }
    }

    if (!model) {
      throw new Error(`No available models. Last error: ${lastError?.message}`);
    }

    // Create system prompt for Notion database schema generation
    const systemPrompt = `You are an AI assistant specialized in creating Notion database schemas. Your role is to:

1. Understand user requirements for database structure
2. Generate comprehensive Notion database schemas with appropriate property types
3. Provide clear explanations of the schema design
4. Suggest best practices for database organization

Available Notion property types:
- title: Main title field (required, only one per database)
- rich_text: Text with formatting
- number: Numeric values
- select: Single choice from predefined options
- multi_select: Multiple choices from predefined options
- date: Date and time values
- people: Notion users
- files: File attachments
- checkbox: Boolean true/false
- url: Web links
- email: Email addresses
- phone_number: Phone numbers
- formula: Calculated values
- relation: Links to other databases
- rollup: Aggregate data from relations
- created_time: Auto timestamp when created
- created_by: Auto user who created
- last_edited_time: Auto timestamp when modified
- last_edited_by: Auto user who last edited

IMPORTANT: When generating JSON schemas, use this exact format:
{
  "title": "Database Title",
  "description": "Database description",
  "properties": {
    "Property Name": {
      "type": "property_type",
      "property_type": {
        // type-specific configuration
      }
    }
  }
}

For select/multi_select properties, include options:
{
  "Status": {
    "type": "select",
    "select": {
      "options": [
        {"name": "Option 1", "color": "blue"},
        {"name": "Option 2", "color": "green"}
      ]
    }
  }
}

For relation properties, use data_source_id (not database_id):
{
  "Related Project": {
    "type": "relation",
    "relation": {
      "data_source_id": "actual-uuid-here",
      "type": "single_property"
    }
  }
}

IMPORTANT: Do NOT use placeholder values like "TARGET_DATABASE_ID" in relation properties. Only include relation properties if you have actual database UUIDs to reference.

When generating schemas:
- Always include a title property as the first property
- Use appropriate property types for the data
- Include helpful descriptions
- Suggest realistic options for select/multi_select fields
- Consider relationships between different data types
- Keep it practical and user-friendly
- AVOID relation properties unless you have actual database UUIDs
- Focus on standalone properties that don't require external references

Respond with:
1. A natural language explanation of the database structure
2. A detailed JSON schema following the exact Notion API format above

User request: ${message}`;

    // Generate response with retry logic
    let result = null;
    let response = null;
    let text = null;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        result = await model.generateContent(systemPrompt);
        response = await result.response;
        text = response.text();
        break; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.log(`Attempt ${retryCount} failed:`, error.message);

        if (retryCount >= maxRetries) {
          throw error; // Re-throw if we've exhausted retries
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Try to extract JSON schema from the response
    let schema = null;
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        schema = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON schema:", e);
      }
    }

    // Extract only the explanation (text before JSON block)
    let explanation = text;
    if (jsonMatch) {
      explanation = text.substring(0, jsonMatch.index).trim();
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content: explanation,
        schema: schema,
      }),
    };
  } catch (error) {
    console.error("Error in gemini-chat function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
}
