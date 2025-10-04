import { Client } from "@notionhq/client";

const NOTION_API_VERSION = "2022-06-28";

// Helper functions for generating sample data
const getSampleTitle = (dataSourceName, propertyName) => {
  const samples = {
    Products: {
      Name: "Wireless Bluetooth Headphones",
      Title: "Wireless Bluetooth Headphones",
      Product: "Wireless Bluetooth Headphones",
    },
    Orders: {
      Order_ID: "ORD-2025-001",
      Title: "Order #ORD-2025-001",
      Name: "Order #ORD-2025-001",
    },
    Customers: {
      Name: "John Smith",
      Title: "John Smith",
      Customer: "John Smith",
    },
  };
  return samples[dataSourceName]?.[propertyName] || `${dataSourceName} Sample`;
};

const getSampleText = (dataSourceName, propertyName) => {
  const samples = {
    Products: {
      Description: "High-quality wireless headphones with noise cancellation",
      Category: "Electronics",
      Brand: "TechBrand",
    },
    Orders: {
      Status: "Processing",
      Payment_Method: "Credit Card",
      Notes: "Customer requested express shipping",
    },
    Customers: {
      Email: "john.smith@email.com",
      Phone: "+1-555-0123",
      Address: "123 Main St, City, State 12345",
    },
  };
  return samples[dataSourceName]?.[propertyName] || "Sample text";
};

const getSampleNumber = (dataSourceName, propertyName) => {
  const samples = {
    Products: {
      Price: 199.99,
      Stock: 50,
      Weight: 0.5,
    },
    Orders: {
      Total: 199.99,
      Quantity: 1,
      Tax: 15.99,
    },
    Customers: {
      Age: 35,
      Orders_Count: 5,
      Credit_Score: 750,
    },
  };
  return samples[dataSourceName]?.[propertyName] || 0;
};

const getSampleSelect = (dataSourceName, propertyName) => {
  const samples = {
    Products: {
      Category: "Electronics",
      Status: "Active",
      Condition: "New",
    },
    Orders: {
      Status: "Processing",
      Priority: "Normal",
      Payment_Status: "Paid",
    },
    Customers: {
      Type: "Premium",
      Status: "Active",
      Tier: "Gold",
    },
  };
  return samples[dataSourceName]?.[propertyName] || "Default";
};

const getSampleCheckbox = (dataSourceName, propertyName) => {
  const samples = {
    Products: {
      In_Stock: true,
      Featured: false,
      Available: true,
    },
    Orders: {
      Shipped: false,
      Paid: true,
      Completed: false,
    },
    Customers: {
      Verified: true,
      Newsletter: true,
      VIP: false,
    },
  };
  return samples[dataSourceName]?.[propertyName] || false;
};

// Test function to check if database has expected columns
async function testDatabaseColumns(notion, databaseId, expectedProperties) {
  console.log(`\n🧪 TESTING DATABASE COLUMNS`);
  console.log(`🔍 DEBUG: Received databaseId parameter:`, databaseId);
  console.log(`🔍 DEBUG: Type of databaseId:`, typeof databaseId);
  console.log(`🔍 DEBUG: Is databaseId undefined?`, databaseId === undefined);
  console.log(`Database ID: ${databaseId}`);
  console.log(
    `Expected Properties: ${Object.keys(expectedProperties).join(", ")}`
  );
  console.log("-".repeat(50));

  try {
    console.log(
      "🔍 DEBUG: About to call notion.databases.retrieve with ID:",
      databaseId
    );
    console.log("🔍 DEBUG: Notion client:", notion);
    console.log("🔍 DEBUG: Calling notion.databases.retrieve...");

    // Create a fresh Notion client to ensure it's properly initialized
    const notionToken = process.env.NOTION_API_KEY;
    const freshNotion = new Client({
      auth: notionToken,
      notionVersion: NOTION_API_VERSION,
    });

    console.log("🔍 DEBUG: Created fresh Notion client");

    // Test if the Notion client is working by trying a simple call
    let database;
    try {
      console.log(
        "🔍 DEBUG: Testing fresh Notion client with a simple call..."
      );
      console.log(
        "🔍 DEBUG: About to call freshNotion.databases.retrieve with:",
        databaseId
      );

      // Try to retrieve the database with explicit error handling
      // Let's try calling it with explicit parameters to see if that helps
      const retrieveParams = { database_id: databaseId };
      console.log("🔍 DEBUG: Retrieve params:", retrieveParams);

      database = await freshNotion.databases.retrieve(retrieveParams);
      console.log("🔍 DEBUG: Database retrieved successfully");
    } catch (apiError) {
      console.log("🔍 DEBUG: Notion API error details:", apiError);
      console.log("🔍 DEBUG: Error message:", apiError.message);
      console.log("🔍 DEBUG: Error code:", apiError.code);
      throw apiError;
    }

    if (!database.properties) {
      console.log("❌ ERROR: Database has no properties");
      console.log(
        "🔍 DEBUG: Database object:",
        JSON.stringify(database, null, 2)
      );
      return {
        success: false,
        error: "No properties found",
        databaseInfo: database,
      };
    }

    const actualProperties = database.properties;
    const actualPropertyNames = Object.keys(actualProperties);

    console.log(`✅ Database retrieved successfully`);
    console.log(`📊 Actual Properties Found: ${actualPropertyNames.length}`);
    console.log(`   Properties: ${actualPropertyNames.join(", ")}`);

    // Compare expected vs actual properties
    const expectedPropertyNames = Object.keys(expectedProperties);
    const missingProperties = expectedPropertyNames.filter(
      (name) => !actualPropertyNames.includes(name)
    );
    const extraProperties = actualPropertyNames.filter(
      (name) => !expectedPropertyNames.includes(name)
    );

    console.log("\n📋 PROPERTY COMPARISON:");
    console.log(`   Expected: ${expectedPropertyNames.length} properties`);
    console.log(`   Actual: ${actualPropertyNames.length} properties`);

    if (missingProperties.length > 0) {
      console.log(`❌ Missing Properties: ${missingProperties.join(", ")}`);
    } else {
      console.log(`✅ All expected properties present`);
    }

    if (extraProperties.length > 0) {
      console.log(`ℹ️  Extra Properties: ${extraProperties.join(", ")}`);
    }

    // Check property types
    console.log("\n🔍 PROPERTY TYPE ANALYSIS:");
    expectedPropertyNames.forEach((propName) => {
      if (actualProperties[propName]) {
        const actualType = actualProperties[propName].type;
        const expectedType = Object.keys(expectedProperties[propName])[0];
        const typeMatch = actualType === expectedType;
        console.log(
          `   ${propName}: ${actualType} ${
            typeMatch ? "✅" : "❌"
          } (expected: ${expectedType})`
        );
      }
    });

    const testResult = {
      success: true,
      expectedCount: expectedPropertyNames.length,
      actualCount: actualPropertyNames.length,
      missingProperties,
      extraProperties,
      allPropertiesPresent: missingProperties.length === 0,
    };

    console.log(
      `\n🎯 TEST RESULT: ${testResult.allPropertiesPresent ? "PASS" : "FAIL"}`
    );
    console.log("-".repeat(50));

    return testResult;
  } catch (error) {
    console.log(`❌ ERROR retrieving database: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Function to create separate databases for each data source
async function createSeparateDatabases(schema, databaseId) {
  // Initialize Notion client
  const notionToken = process.env.NOTION_API_KEY;
  const parentPageId = databaseId || process.env.NOTION_PARENT_PAGE_ID;

  if (!notionToken) {
    console.error("NOTION_API_KEY is not configured");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Notion API token not configured" }),
    };
  }

  if (!parentPageId) {
    console.error("No parent page ID provided and no default configured");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error:
          "Parent page ID is required. Please provide a page ID or set NOTION_PARENT_PAGE_ID in your environment variables.",
      }),
    };
  }

  const notion = new Client({
    auth: notionToken,
    notionVersion: NOTION_API_VERSION,
  });

  console.log("🚀 Starting Separate Database Creation Process");
  console.log("=".repeat(60));

  // STEP 1: CREATE ALL DATABASES
  console.log("📋 STEP 1: CREATING ALL DATABASES");
  console.log("-".repeat(40));
  console.log(`Found ${schema.dataSources.length} data sources to create:`);
  schema.dataSources.forEach((ds, index) => {
    console.log(`  ${index + 1}. ${ds.name} - ${ds.description}`);
  });
  console.log("-".repeat(40));

  // Create separate databases for each data source
  const createdDatabases = [];
  const sampleData = [];

  if (schema.dataSources && schema.dataSources.length > 0) {
    for (const dataSource of schema.dataSources) {
      try {
        console.log(
          `\n📊 Creating database ${createdDatabases.length + 1}/${
            schema.dataSources.length
          }: ${dataSource.name}`
        );
        console.log(`   Description: ${dataSource.description}`);

        // Use properties from the schema instead of hardcoded ones
        const properties = dataSource.properties || {};
        
        console.log(`   Properties: ${Object.keys(properties).length} properties`);
        Object.keys(properties).forEach(propName => {
          console.log(`     - ${propName}: ${Object.keys(properties[propName])[0]}`);
        });

        // Create a separate database for this data source
        const databaseData = {
          parent: {
            type: "page_id",
            page_id: parentPageId,
          },
          title: [
            {
              type: "text",
              text: {
                content: `${schema.title} - ${dataSource.name}`,
              },
            },
          ],
          description: dataSource.description
            ? [
                {
                  type: "text",
                  text: {
                    content: dataSource.description,
                  },
                },
              ]
            : [],
          properties: properties,
        };

        let createdDatabase;
        try {
          createdDatabase = await notion.databases.create(databaseData);
          console.log(`Successfully created database: ${dataSource.name}`);
        } catch (createError) {
          console.error(
            `Database creation failed for ${dataSource.name}:`,
            createError
          );
          throw new Error(
            `Database creation failed for ${dataSource.name}: ${createError.message}`
          );
        }

        // Check if database was created successfully and has an ID
        if (!createdDatabase || !createdDatabase.id) {
          throw new Error(
            `Database creation failed for ${dataSource.name}: No ID returned`
          );
        }

        // Database created successfully with properties
        console.log(
          `✅ Database ${dataSource.name} created successfully with properties:`,
          Object.keys(properties)
        );
        console.log(`   Database ID: ${createdDatabase.id}`);
        console.log(`   Database URL: ${createdDatabase.url}`);

        // Test the database to verify columns were created
        const testResult = await testDatabaseColumns(
          notion,
          createdDatabase.id,
          properties
        );
        if (!testResult.success) {
          console.log(
            `⚠️  WARNING: Database test failed for ${dataSource.name}`
          );
        }

        createdDatabases.push({
          name: dataSource.name,
          description: dataSource.description,
          database: createdDatabase,
          url: createdDatabase.url,
          id: createdDatabase.id,
          properties: Object.keys(properties),
        });
      } catch (error) {
        console.error(`Error creating database for ${dataSource.name}:`, error);

        // Still add to createdDatabases with error status so the process continues
        createdDatabases.push({
          name: dataSource.name,
          description: dataSource.description,
          error: error.message,
          status: "error",
        });
      }
    }
  }

  // STEP 1 COMPLETION
  console.log("-".repeat(40));
  console.log("✅ STEP 1 COMPLETED: DATABASE CREATION");
  console.log(
    `Successfully created ${
      createdDatabases.filter((db) => !db.status || db.status !== "error")
        .length
    } databases`
  );
  console.log(
    `Failed to create ${
      createdDatabases.filter((db) => db.status === "error").length
    } databases`
  );
  console.log("-".repeat(40));

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      success: true,
      databases: createdDatabases,
      sampleData: sampleData,
      message: `E-commerce system created successfully with ${createdDatabases.length} separate databases`,
      errors: createdDatabases.filter((db) => db.status === "error"),
      hasErrors: createdDatabases.some((db) => db.status === "error"),
    }),
  };
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

export async function handler(event, context) {
  console.log("🔍 DEBUG: Function called with method:", event.httpMethod);
  console.log(
    "🔍 DEBUG: Query string parameters:",
    event.queryStringParameters
  );

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
    };
  }

  // Handle test requests
  if (event.httpMethod === "GET" && event.queryStringParameters?.test) {
    const databaseUrl = event.queryStringParameters.url;
    if (!databaseUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Database URL required for testing" }),
      };
    }

    // Extract database ID from URL and format as UUID
    const rawId = databaseUrl.split("/").pop();
    // If the ID already has hyphens, use it as is, otherwise format it
    const databaseId = rawId.includes("-")
      ? rawId
      : rawId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
    console.log("🔍 DEBUG: Raw ID:", rawId);
    console.log("🔍 DEBUG: Formatted database ID:", databaseId);

    const notionToken = process.env.NOTION_API_KEY;
    if (!notionToken) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Notion token not configured" }),
      };
    }

    const notion = new Client({
      auth: notionToken,
      notionVersion: NOTION_API_VERSION,
    });

    // Test with expected properties for different database types
    const expectedProperties = {
      Products: {
        Name: { title: {} },
        Description: { rich_text: {} },
        Category: { select: {} },
        Price: { number: {} },
        SKU: { rich_text: {} },
        "Image URL": { url: {} },
        "Is Featured": { checkbox: {} },
        "Created Date": { created_time: {} },
      },
      Orders: {
        "Order ID": { title: {} },
        "Customer Name": { rich_text: {} },
        "Order Date": { date: {} },
        Status: { select: {} },
        Items: { rich_text: {} },
        "Total Amount": { number: {} },
        "Shipping Address": { rich_text: {} },
        "Billing Address": { rich_text: {} },
        "Payment Method": { select: {} },
      },
      Customers: {
        "Customer Name": { title: {} },
        Email: { email: {} },
        "Phone Number": { phone_number: {} },
        "Billing Address": { rich_text: {} },
        "Shipping Address": { rich_text: {} },
        "Registration Date": { created_time: {} },
        "Loyalty Points": { number: {} },
      },
      Inventory: {
        "Product Name": { title: {} },
        SKU: { rich_text: {} },
        "Quantity on Hand": { number: {} },
        "Reorder Point": { number: {} },
        Supplier: { rich_text: {} },
        "Last Updated": { last_edited_time: {} },
      },
    };

    console.log(`🧪 STANDALONE DATABASE TEST`);
    console.log(`Database URL: ${databaseUrl}`);
    console.log(`Database ID: ${databaseId}`);

    // Try to determine database type from URL or test with all types
    const testResults = {};

    for (const [dbType, properties] of Object.entries(expectedProperties)) {
      console.log(`\n🔍 Testing against ${dbType} schema...`);
      const result = await testDatabaseColumns(notion, databaseId, properties);
      testResults[dbType] = result;

      // Add debug info to the result
      testResults[dbType].debug = {
        databaseId: databaseId,
        databaseIdType: typeof databaseId,
        isUndefined: databaseId === undefined,
        notionClientExists: !!notion,
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        databaseUrl,
        databaseId,
        testResults,
        message: "Database column test completed",
      }),
    };
  }

  // Handle POST requests for database creation
  if (event.httpMethod === "POST") {
    try {
      const {
        schema,
        databaseId,
        mode = "multi-source",
      } = JSON.parse(event.body);

    if (!schema) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Schema is required" }),
      };
    }

      // Check if we should create separate databases instead of multi-source
      if (mode === "separate") {
        return await createSeparateDatabases(schema, databaseId);
      }

    // Initialize Notion client
    const notionToken = process.env.NOTION_API_KEY;
    const parentPageId = databaseId || process.env.NOTION_PARENT_PAGE_ID;

    if (!notionToken) {
      console.error("NOTION_API_KEY is not configured");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Notion API token not configured" }),
      };
    }

    if (!parentPageId) {
      console.error("No parent page ID provided and no default configured");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error:
            "Parent page ID is required. Please provide a page ID or set NOTION_PARENT_PAGE_ID in your environment variables.",
        }),
      };
    }

    const notion = new Client({
      auth: notionToken,
      notionVersion: NOTION_API_VERSION,
    });

      // Create the main database with properties from the first data source
      const firstDataSource =
        schema.dataSources && schema.dataSources.length > 0
          ? schema.dataSources[0]
          : null;

    const databaseData = {
      parent: {
        type: "page_id",
        page_id: parentPageId,
      },
      title: [
        {
          type: "text",
          text: {
            content: schema.title,
          },
        },
      ],
      description: schema.description
        ? [
            {
              type: "text",
              text: {
                content: schema.description,
              },
            },
          ]
        : [],
        properties: firstDataSource ? firstDataSource.properties : {},
      };

    const createdDatabase = await notion.databases.create(databaseData);
      console.log(`Created main database: ${createdDatabase.id}`);

      // Create additional data sources using the proper Notion API
    const createdDataSources = [];
    if (schema.dataSources && schema.dataSources.length > 1) {
      for (let i = 1; i < schema.dataSources.length; i++) {
        const dataSource = schema.dataSources[i];

        try {
            console.log(`Creating data source: ${dataSource.name}`);
            console.log(`Data source properties:`, dataSource.properties);

            // Try using the Notion client to update the database with additional properties
            // Since the /v1/data_sources endpoint might not exist, let's try updating the database
            const updatedProperties = { ...createdDatabase.properties };

            // Add properties from this data source with a prefix
            Object.entries(dataSource.properties).forEach(([key, value]) => {
              const prefixedKey = `${dataSource.name}_${key}`;
              updatedProperties[prefixedKey] = value;
            });

            console.log(
              `Updating database with properties for ${dataSource.name}`
            );

            // Update the database with additional properties
            const updateResponse = await notion.databases.update({
              database_id: createdDatabase.id,
              properties: updatedProperties,
            });

            console.log(
              `Successfully updated database with ${dataSource.name} properties`
            );

            createdDataSources.push({
              name: dataSource.name,
              description: dataSource.description,
              properties: dataSource.properties,
              status: "created",
            });
          } catch (error) {
            console.error(
              `Error creating data source ${dataSource.name}:`,
              error
            );

            // If updating fails, still add to createdDataSources with error status
            createdDataSources.push({
            name: dataSource.name,
            description: dataSource.description,
            properties: dataSource.properties,
              status: "error",
              error: error.message,
            });
          }
        }
      }

      // Add sample data for each data source
      const sampleData = [];
      if (schema.dataSources && schema.dataSources.length > 0) {
        for (const dataSource of schema.dataSources) {
          try {
            // Create a sample page for this data source
            const samplePageData = {
              parent: {
                database_id: createdDatabase.id,
              },
              properties: {},
            };

            let hasTitle = false;

            // Add sample data based on data source type
            Object.entries(dataSource.properties).forEach(([key, value]) => {
              const prefixedKey = `${dataSource.name}_${key}`;

              if (value.title && !hasTitle) {
                // Only add one title property per page
                samplePageData.properties[prefixedKey] = {
                  title: [
                    {
                      text: {
                        content: getSampleTitle(dataSource.name, key),
                      },
                    },
                  ],
                };
                hasTitle = true;
              } else if (value.rich_text) {
                samplePageData.properties[prefixedKey] = {
                  rich_text: [
                    {
                      text: {
                        content: getSampleText(dataSource.name, key),
                      },
                    },
                  ],
                };
              } else if (value.number) {
                samplePageData.properties[prefixedKey] = {
                  number: getSampleNumber(dataSource.name, key),
                };
              } else if (value.select) {
                samplePageData.properties[prefixedKey] = {
                  select: {
                    name: getSampleSelect(dataSource.name, key),
                  },
                };
              } else if (value.checkbox) {
                samplePageData.properties[prefixedKey] = {
                  checkbox: getSampleCheckbox(dataSource.name, key),
                };
              } else if (value.date) {
                samplePageData.properties[prefixedKey] = {
                  date: {
                    start: new Date().toISOString().split("T")[0],
                  },
                };
              }
            });

            // Ensure we have at least one property
            if (Object.keys(samplePageData.properties).length === 0) {
              // Add a default title if no properties were added
              const firstProperty = Object.keys(dataSource.properties)[0];
              if (firstProperty) {
                samplePageData.properties[
                  `${dataSource.name}_${firstProperty}`
                ] = {
                  title: [
                    {
                      text: {
                        content: `${dataSource.name} Sample Entry`,
                      },
                    },
                  ],
                };
              }
            }

            console.log(
              `Creating sample page for ${dataSource.name}:`,
              samplePageData
            );
            const samplePage = await notion.pages.create(samplePageData);
            sampleData.push({
              dataSource: dataSource.name,
              pageId: samplePage.id,
              url: samplePage.url,
            });
            console.log(
              `Successfully created sample page for ${dataSource.name}`
            );
          } catch (error) {
            console.error(
              `Failed to create sample data for ${dataSource.name}:`,
              error
            );
        }
      }
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        database: createdDatabase,
          dataSources: schema.dataSources || [],
          createdDataSources: createdDataSources,
          sampleData: sampleData,
        message: `Multi-source database "${
          schema.title
        }" created successfully with ${
          schema.dataSources?.length || 1
          } data source(s) and sample data`,
      }),
    };
  } catch (error) {
    console.error("Error creating multi-source database:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to create multi-source database",
        message: error.message,
      }),
    };
  }
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
}
