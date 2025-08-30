# Generic Notion CRUD Proxy Server Usage Guide

## Overview

The `notion-crud.js` function is now a **generic CRUD proxy server** that can work with **any Notion database** and **any type of data**. It's no longer limited to just talent profiles - you can use it for:

- 🏢 **Company databases** (clients, vendors, partners)
- 📋 **Project databases** (tasks, milestones, resources)
- 👥 **Contact databases** (customers, leads, team members)
- 📚 **Content databases** (articles, products, services)
- 🎯 **Any custom database** you create in Notion

## API Endpoints

### Base URL

```
/.netlify/functions/notion-crud
```

### Supported Methods

- `GET` - Retrieve records
- `POST` - Create new records
- `PUT` - Update existing records
- `DELETE` - Archive records
- `OPTIONS` - CORS preflight

## Usage Examples

### 1. Get All Records from Default Database

```javascript
// Uses the NOTION_DATABASE_ID from environment variables
const response = await fetch("/.netlify/functions/notion-crud");
const data = await response.json();
```

### 2. Get All Records from Specific Database

```javascript
// Specify a different database ID
const response = await fetch(
  "/.netlify/functions/notion-crud?database_id=your_database_id"
);
const data = await response.json();
```

### 3. Get Specific Record

```javascript
const response = await fetch("/.netlify/functions/notion-crud?id=record_id");
const data = await response.json();
```

### 4. Create New Record

```javascript
const response = await fetch("/.netlify/functions/notion-crud", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    "Company Name": "Acme Corp",
    Industry: "Technology",
    "Contact Person": "John Doe",
    Email: "john@acme.com",
    Status: "Active",
  }),
});
```

### 5. Update Record

```javascript
const response = await fetch("/.netlify/functions/notion-crud?id=record_id", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    Status: "Inactive",
    Notes: "Updated status",
  }),
});
```

### 6. Delete (Archive) Record

```javascript
const response = await fetch("/.netlify/functions/notion-crud?id=record_id", {
  method: "DELETE",
});
```

## Query Parameters

### GET Requests

| Parameter      | Type   | Description                | Default                      |
| -------------- | ------ | -------------------------- | ---------------------------- |
| `id`           | string | Get specific record by ID  | -                            |
| `database_id`  | string | Target database ID         | `NOTION_DATABASE_ID` env var |
| `page_size`    | number | Number of records per page | 100                          |
| `start_cursor` | string | Pagination cursor          | -                            |

### Example with Pagination

```javascript
const response = await fetch(
  "/.netlify/functions/notion-crud?page_size=20&start_cursor=cursor_id"
);
```

## Database Schema Flexibility

The proxy automatically adapts to your Notion database structure:

### Supported Property Types

- ✅ **Title** → Text input
- ✅ **Rich Text** → Textarea
- ✅ **Email** → Email input with validation
- ✅ **Phone** → Phone input
- ✅ **URL** → URL input with validation
- ✅ **Number** → Number input
- ✅ **Select** → Dropdown
- ✅ **Multi-select** → Tag selector
- ✅ **Checkbox** → Checkbox
- ✅ **Date** → Date picker
- ✅ **Status** → Status dropdown

### Automatic Type Detection

The proxy intelligently maps field names to appropriate Notion property types:

```javascript
// These field names automatically get the right type
{
  'Company Name': 'Acme Corp',        // → Title
  'Email': 'contact@acme.com',        // → Email
  'Phone': '+1-555-0123',            // → Phone
  'Website': 'https://acme.com',      // → URL
  'Employee Count': 150,              // → Number
  'Industry': 'Technology',           // → Select
  'Tags': ['B2B', 'SaaS'],           // → Multi-select
  'Active': true,                     // → Checkbox
  'Founded': '2020-01-15',           // → Date
  'Status': 'Active'                  // → Status
}
```

## Use Cases

### 1. Company Database

```javascript
// Create company record
const company = {
  "Company Name": "TechStart Inc",
  Industry: "Software",
  Size: "Startup",
  Website: "https://techstart.com",
  "Contact Email": "hello@techstart.com",
  "Funding Stage": "Series A",
  Active: true,
};
```

### 2. Project Database

```javascript
// Create project record
const project = {
  "Project Name": "E-commerce Platform",
  Client: "Retail Corp",
  "Start Date": "2024-01-01",
  "End Date": "2024-06-30",
  Budget: 50000,
  Status: "In Progress",
  "Team Members": ["John", "Jane", "Bob"],
  Priority: "High",
};
```

### 3. Contact Database

```javascript
// Create contact record
const contact = {
  "Full Name": "Sarah Johnson",
  Company: "Marketing Pro",
  Email: "sarah@marketingpro.com",
  Phone: "+1-555-0124",
  LinkedIn: "https://linkedin.com/in/sarahjohnson",
  Tags: ["Marketing", "B2B", "Consultant"],
  "Last Contact": "2024-01-15",
  "Follow Up": true,
};
```

## Error Handling

The proxy provides consistent error responses:

```javascript
// Success Response
{
  "success": true,
  "results": [...], // or "result" for single record
  "message": "Record created successfully"
}

// Error Response
{
  "error": "Error message here"
}
```

## Environment Variables

```env
# Required
NOTION_API_KEY=your_integration_token

# Optional (default database)
NOTION_DATABASE_ID=your_default_database_id
```

## Security Features

- ✅ **CORS enabled** for cross-origin requests
- ✅ **Input validation** for all data types
- ✅ **Error handling** with detailed messages
- ✅ **Rate limiting** through Notion's API limits
- ✅ **Authentication** via Notion integration tokens

## Performance Features

- 🚀 **Efficient pagination** for large datasets
- 🚀 **Smart filtering** (archived property detection)
- 🚀 **Optimized queries** with proper Notion API usage
- 🚀 **Response caching** recommendations for frontend

## Frontend Integration

### JavaScript Example

```javascript
class NotionService {
  constructor(baseUrl = "/.netlify/functions/notion-crud") {
    this.baseUrl = baseUrl;
  }

  async getAllRecords(databaseId = null, options = {}) {
    const params = new URLSearchParams();
    if (databaseId) params.append("database_id", databaseId);
    if (options.pageSize) params.append("page_size", options.pageSize);
    if (options.startCursor) params.append("start_cursor", options.startCursor);

    const response = await fetch(`${this.baseUrl}?${params}`);
    return response.json();
  }

  async getRecord(id, databaseId = null) {
    const params = new URLSearchParams({ id });
    if (databaseId) params.append("database_id", databaseId);

    const response = await fetch(`${this.baseUrl}?${params}`);
    return response.json();
  }

  async createRecord(data, databaseId = null) {
    const params = new URLSearchParams();
    if (databaseId) params.append("database_id", databaseId);

    const response = await fetch(`${this.baseUrl}?${params}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateRecord(id, data, databaseId = null) {
    const params = new URLSearchParams({ id });
    if (databaseId) params.append("database_id", databaseId);

    const response = await fetch(`${this.baseUrl}?${params}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteRecord(id, databaseId = null) {
    const params = new URLSearchParams({ id });
    if (databaseId) params.append("database_id", databaseId);

    const response = await fetch(`${this.baseUrl}?${params}`, {
      method: "DELETE",
    });
    return response.json();
  }
}

// Usage
const notionService = new NotionService();

// Get all companies
const companies = await notionService.getAllRecords();

// Create new project
const project = await notionService.createRecord({
  "Project Name": "New Website",
  Client: "Client Corp",
  Status: "Planning",
});
```

## Testing

### Test with curl

```bash
# Get all records
curl "https://your-site.netlify.app/.netlify/functions/notion-crud"

# Create record
curl -X POST "https://your-site.netlify.app/.netlify/functions/notion-crud" \
  -H "Content-Type: application/json" \
  -d '{"Name": "Test Record", "Status": "Active"}'

# Update record
curl -X PUT "https://your-site.netlify.app/.netlify/functions/notion-crud?id=record_id" \
  -H "Content-Type: application/json" \
  -d '{"Status": "Completed"}'
```

## Migration from talent-crud.js

If you were using the old `talent-crud.js`:

1. **Update endpoint URLs** from `/talent-crud` to `/notion-crud`
2. **Add database_id parameter** if using multiple databases
3. **Update field names** to match your new database schema
4. **Test all CRUD operations** with your new data structure

## Best Practices

1. **Use descriptive field names** that indicate the data type
2. **Implement proper validation** on the frontend
3. **Handle pagination** for large datasets
4. **Cache responses** when appropriate
5. **Monitor API usage** to stay within Notion's limits
6. **Use consistent naming** across your databases

## Support

For issues or questions:

1. Check the `TROUBLESHOOTING.md` file
2. Review the error messages in the response
3. Verify your Notion database structure
4. Test with the curl examples above
5. Check the Netlify function logs

---

**The generic CRUD proxy gives you the power to build any type of application with Notion as your backend!** 🚀
