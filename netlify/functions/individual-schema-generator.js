import { GoogleGenerativeAI } from "@google/generative-ai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

// Define Zod schema for individual database schema
const IndividualDatabaseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  properties: z.record(
    z.string(),
    z.object({
      title: z.object({}).optional(),
      rich_text: z.object({}).optional(),
      number: z
        .object({
          format: z
            .enum([
              "number",
              "number_with_commas",
              "percent",
              "dollar",
              "canadian_dollar",
              "euro",
              "pound",
              "yen",
              "ruble",
              "rupee",
              "won",
              "yuan",
            ])
            .optional(),
        })
        .optional(),
      select: z
        .object({
          options: z.array(
            z.object({
              name: z.string(),
              color: z
                .enum([
                  "default",
                  "gray",
                  "brown",
                  "orange",
                  "yellow",
                  "green",
                  "blue",
                  "purple",
                  "pink",
                  "red",
                ])
                .optional(),
            })
          ),
        })
        .optional(),
      multi_select: z
        .object({
          options: z.array(
            z.object({
              name: z.string(),
              color: z
                .enum([
                  "default",
                  "gray",
                  "brown",
                  "orange",
                  "yellow",
                  "green",
                  "blue",
                  "purple",
                  "pink",
                  "red",
                ])
                .optional(),
            })
          ),
        })
        .optional(),
      date: z.object({}).optional(),
      people: z.object({}).optional(),
      files: z.object({}).optional(),
      checkbox: z.object({}).optional(),
      url: z.object({}).optional(),
      email: z.object({}).optional(),
      phone_number: z.object({}).optional(),
      created_time: z.object({}).optional(),
      created_by: z.object({}).optional(),
      last_edited_time: z.object({}).optional(),
      last_edited_by: z.object({}).optional(),
    })
  ),
});

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
    const {
      message,
      context: userContext,
      existingDatabases,
    } = JSON.parse(event.body);

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

    // Create system prompt for individual schema generation
    const systemPrompt = `You are an AI assistant specialized in creating INDIVIDUAL Notion database schemas for different entities. Your role is to:

1. Understand user requirements for separate database entities
2. Generate individual database schemas for each entity mentioned
3. Create complete, functional schemas for each separate database
4. Provide clear explanations of each database design

CRITICAL: You must return an ARRAY of individual database schemas, not a multi-source database.

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

REQUIRED RESPONSE FORMAT - ARRAY OF SCHEMAS:
[
  {
    "title": "Entity Database Name",
    "description": "Description of what this database manages",
    "properties": {
      "Property Name": {"property_type": {"configuration": "value"}}
    }
  }
]

Property types and their configurations (use these exact formats):
- title: {"title": {}}
- rich_text: {"rich_text": {}}
- number: {"number": {"format": "number"}}
- select: {"select": {"options": [{"name": "Option 1", "color": "blue"}]}}
- multi_select: {"multi_select": {"options": [{"name": "Tag 1", "color": "green"}]}}
- date: {"date": {}}
- people: {"people": {}}
- files: {"files": {}}
- checkbox: {"checkbox": {}}
- url: {"url": {}}
- email: {"email": {}}
- phone_number: {"phone_number": {}}
- created_time: {"created_time": {}}
- created_by: {"created_by": {}}
- last_edited_time: {"last_edited_time": {}}
- last_edited_by: {"last_edited_by": {}}

CRITICAL RULES FOR INDIVIDUAL SCHEMAS:
1. Return an ARRAY of schemas, not an object
2. Each schema is a separate, independent database
3. Include a title property as the first property in each schema
4. Each schema should be functional on its own
5. Use appropriate property types for the data
6. Include helpful descriptions for consistency
7. AVOID relation properties unless you have actual database UUIDs
8. Focus on standalone properties that don't require external references

COMMON E-COMMERCE ENTITIES:
- Products: Product catalog with categories, pricing, inventory
- Orders: Order management with status tracking, payment methods
- Customers: Customer information, contact details, purchase history
- Inventory: Stock management, reorder points, supplier info

When generating individual schemas:
- Create separate schemas for each entity mentioned
- Each schema should have a single focus on one entity type
- Include all necessary properties for that entity
- Make each schema complete and functional on its own
- Use descriptive titles and consistent naming

${
  existingDatabases
    ? `EXISTING DATABASES CONTEXT:
${JSON.stringify(existingDatabases, null, 2)}

Consider how the new individual databases might relate to these existing databases.`
    : ""
}

Respond with:
1. A natural language explanation of the individual database schemas
2. A detailed JSON schema as an ARRAY of individual database schemas

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
          throw error;
        }
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
      }
    }

    console.log("Raw response text:", text);

    // Extract JSON from response
    let explanation = "";
    let schemas = [];

    // Try to find JSON within code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const parsedSchemas = JSON.parse(jsonMatch[1]);
        // Validate that it's an array
        if (Array.isArray(parsedSchemas)) {
          schemas = parsedSchemas;
          explanation = text
            .substring(0, jsonMatch.index)
            .replace(/\n/g, " ")
            .trim();
        } else {
          throw new Error("Expected array of schemas");
        }
      } catch (e) {
        console.error("Failed to parse JSON schemas:", e);
        // Try to find JSON without code blocks
        const directJsonMatch = text.match(/\[[\s\S]*\]/);
        if (directJsonMatch) {
          try {
            const parsedSchemas = JSON.parse(directJsonMatch[0]);
            if (Array.isArray(parsedSchemas)) {
              schemas = parsedSchemas;
              explanation = text.substring(0, directJsonMatch.index).trim();
            }
          } catch (e2) {
            console.error("Failed to parse direct JSON:", e2);
          }
        }
      }
    } else {
      // Try to find JSON without code blocks
      const directJsonMatch = text.match(/\[[\s\S]*\]/);
      if (directJsonMatch) {
        try {
          const parsedSchemas = JSON.parse(directJsonMatch[0]);
          if (Array.isArray(parsedSchemas)) {
            schemas = parsedSchemas;
            explanation = text.substring(0, directJsonMatch.index).trim();
          }
        } catch (e) {
          console.error("Failed to parse direct JSON:", e);
        }
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content: explanation,
        schema: schemas,
        type: "individual-schemas",
        individual_schemas: true,
      }),
    };
  } catch (error) {
    console.error("Error in individual-schema-generator function:", error);
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
