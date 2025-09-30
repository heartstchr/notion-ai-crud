import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { zodToJsonSchema } from "@alcyone-labs/zod-to-json-schema";

// Zod schema for Notion database structure
const NotionDatabaseSchema = z.object({
  title: z.string().min(1, "Database title is required"),
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
              "percent",
              "dollar",
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

IMPORTANT: You must return a valid JSON schema that matches the Notion API format exactly. The response must be parseable JSON that follows this structure:

{
  "title": "Database Title",
  "description": "Database description",
  "properties": {
    "Property Name": {
      "property_type": {
        // type-specific configuration
      }
    }
  }
}

Property types and their configurations:
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

The JSON must be valid and parseable. Do not include any text outside the JSON block.

REQUIRED SCHEMA STRUCTURE (automatically generated from Zod schema):
${JSON.stringify(
  zodToJsonSchema(NotionDatabaseSchema, { name: "NotionDatabaseSchema" }),
  null,
  2
)}

This JSON Schema defines the exact structure your response must follow. Ensure your output matches this schema exactly.

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
    let explanation = text;

    // First try to find JSON in code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsedSchema = JSON.parse(jsonMatch[1]);
        // Validate the schema using Zod
        const validatedSchema = NotionDatabaseSchema.parse(parsedSchema);
        schema = validatedSchema;
        explanation = text.substring(0, jsonMatch.index).trim();
      } catch (e) {
        console.error("Failed to parse or validate JSON schema:", e);
        // Try to find JSON without code blocks
        const directJsonMatch = text.match(/\{[\s\S]*\}/);
        if (directJsonMatch) {
          try {
            const parsedSchema = JSON.parse(directJsonMatch[0]);
            const validatedSchema = NotionDatabaseSchema.parse(parsedSchema);
            schema = validatedSchema;
            explanation = text.substring(0, directJsonMatch.index).trim();
          } catch (e2) {
            console.error("Failed to parse direct JSON:", e2);
          }
        }
      }
    } else {
      // Try to find JSON without code blocks
      const directJsonMatch = text.match(/\{[\s\S]*\}/);
      if (directJsonMatch) {
        try {
          const parsedSchema = JSON.parse(directJsonMatch[0]);
          const validatedSchema = NotionDatabaseSchema.parse(parsedSchema);
          schema = validatedSchema;
          explanation = text.substring(0, directJsonMatch.index).trim();
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
