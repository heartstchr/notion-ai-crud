# Codebase Structure & Architecture Guide

This document provides a comprehensive overview of the Notion CRUD application architecture, data flow, and implementation details. Use this guide to understand how to modify existing features or implement new ones.

## 🏗️ Overall Architecture

The application follows a **3-tier architecture** with clear separation of concerns:

1. **Frontend (Vue.js SPA)** - User interface and client-side logic
2. **Backend (Netlify Functions)** - Serverless API proxy to Notion
3. **Database (Notion API)** - Data storage and schema management

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Notion API   │
│   (Vue.js)      │◄──►│  (Netlify Fn)   │◄──►│   (Database)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
notion-crud/
├── frontend/                    # Vue.js frontend application
│   ├── src/
│   │   ├── components/         # Reusable Vue components
│   │   ├── views/              # Page-level components
│   │   ├── stores/             # Pinia state management
│   │   ├── services/           # API and business logic
│   │   ├── utils/              # Helper functions and utilities
│   │   └── router/             # Vue Router configuration
│   ├── public/                 # Static assets (built files)
│   └── package.json
├── netlify/
│   └── functions/
│       └── notion-crud.js      # Main API proxy function
├── netlify.toml                # Netlify configuration
└── package.json                # Root package.json
```

## 🔄 Data Flow Architecture

### 1. Request Flow (Frontend → Backend → Notion)

```
User Action → Component → Store → Service → Netlify Function → Notion API
```

**Example: Creating a new item**

1. User fills form in `AddView.vue`
2. Form submission calls `itemStore.createItem()`
3. Store calls `itemService.createItem()`
4. Service makes HTTP request to `/.netlify/functions/notion-crud`
5. Netlify function processes request and calls Notion API
6. Response flows back through the same chain

### 2. Data Transformation Pipeline

```
Raw Notion Data → NotionMiddleware → Store → Component → UI
```

**Key Transformations:**

- **NotionMiddleware**: Converts between Notion API format and frontend-friendly format
- **ValidationService**: Validates form data before submission
- **MappingUtils**: Handles field type mapping, icons, and styling

## 🎯 Core Features & Implementation

### Feature 1: Dynamic Schema Detection

**How it works:**

1. `itemService.getDatabaseInfo()` fetches database schema from Notion
2. `NotionMiddleware.extractDatabaseInfo()` processes raw schema
3. `NotionMiddleware.generateSchema()` creates frontend-compatible schema
4. Components dynamically render forms based on schema

**Key files:**

- `services/itemService.js` - API calls
- `services/notionMiddleware.js` - Data transformation
- `components/FormFields.vue` - Dynamic form rendering

### Feature 2: CRUD Operations

**Create:**

```javascript
// Flow: AddView → ItemStore → ItemService → NotionMiddleware → Netlify Function
itemStore.createItem(formData)
  → itemService.createItem(data, schema)
  → NotionMiddleware.convertToNotionProperties(data, schema)
  → POST /.netlify/functions/notion-crud
```

**Read:**

```javascript
// Flow: HomeView → ItemStore → ItemService → NotionMiddleware
itemStore.fetchAllItems()
  → itemService.getAllItems()
  → GET /.netlify/functions/notion-crud
  → NotionMiddleware.transformResultsResponse()
```

**Update:**

```javascript
// Flow: EditView → ItemStore → ItemService → NotionMiddleware → Netlify Function
itemStore.updateItem(id, formData)
  → itemService.updateItem(id, data, schema)
  → PUT /.netlify/functions/notion-crud?id={id}
```

**Delete:**

```javascript
// Flow: CardView → ItemStore → ItemService → Netlify Function
itemStore.deleteItem(id)
  → itemService.deleteItem(id)
  → DELETE /.netlify/functions/notion-crud?id={id}
```

### Feature 3: Field Type Handling

**Supported Field Types:**

- `title` - Main title field
- `rich_text` - Multi-line text
- `email` - Email validation
- `phone_number` - Phone validation
- `url` - URL validation with link functionality
- `number` - Numeric fields with currency support
- `select` - Single-choice dropdown
- `multi_select` - Multi-choice with tags
- `checkbox` - Boolean fields
- `date` - Date picker
- `status` - Status indicators

**Field Rendering Pipeline:**

1. Schema defines field type and properties
2. `FormFields.vue` categorizes fields by type
3. Specialized field renderers handle display/input
4. `MappingUtils.js` provides icons, validation, formatting

## 🏪 State Management (Pinia Stores)

### ItemStore (`stores/itemStore.js`)

**State:**

```javascript
{
  items: [],              // Current items list
  currentItem: null,      // Item being edited
  schema: null,           // Database schema
  databaseInfo: null,     // Full database metadata
  loading: false,         // Loading state
  submitting: false,      // Form submission state
  error: null            // Error messages
}
```

**Key Actions:**

- `fetchAllItems()` - Load items list
- `fetchItem(id)` - Load single item for editing
- `fetchSchema()` - Load database schema
- `createItem(data)` - Create new item
- `updateItem(id, data)` - Update existing item
- `deleteItem(id)` - Delete item (archive in Notion)

### MappingStore (`stores/mappingStore.js`)

Currently empty - reserved for future mapping configurations.

## 🛠️ Services Layer

### ItemService (`services/itemService.js`)

**Purpose:** Main API communication layer with caching
**Key Features:**

- HTTP request handling
- Response caching (5-minute TTL)
- Error handling and retry logic
- Data transformation coordination

**Key Methods:**

```javascript
getDatabaseInfo(); // Get schema information
getAllItems(); // Fetch items with pagination
getItem(id); // Fetch single item
createItem(data); // Create new item
updateItem(id, data); // Update existing item
deleteItem(id); // Delete item
```

### NotionMiddleware (`services/notionMiddleware.js`)

**Purpose:** Data transformation between Notion API and frontend
**Key Features:**

- Schema extraction and processing
- Property flattening (Notion → simple key-value)
- Property conversion (simple → Notion format)
- Icon and emoji extraction

**Key Methods:**

```javascript
flattenProperties(properties); // Notion → Frontend format
convertToNotionProperties(data, schema); // Frontend → Notion format
extractDatabaseInfo(database); // Process raw database schema
generateSchema(properties); // Create frontend schema
transformPage(page); // Transform single item
```

### ValidationService (`services/validationService.js`)

**Purpose:** Form validation and error handling
**Validation Rules:**

- Required field validation
- Type-specific validation (email, phone, URL)
- Number range validation
- Select option validation
- Custom validation rules

## 🎨 Component Architecture

### Views (Page-level components)

**HomeView.vue**

- Main dashboard displaying items grid
- Handles schema loading and item fetching
- Manages loading states and error handling
- Coordinates with ListView component

**AddView.vue**

- Form for creating new items
- Dynamic form generation based on schema
- Form validation and submission
- Success/error handling with toast notifications

**EditView.vue**

- Form for editing existing items
- Pre-populates form with current values
- Similar validation and submission to AddView
- Handles item loading and error states

### Components

**FormFields.vue**

- Dynamic form field generation
- Field categorization and grouping
- Handles all form field types
- Real-time validation feedback

**CardView.vue**

- Individual item display card
- Field-specific rendering and formatting
- Action buttons (edit, delete)
- Responsive layout with field grouping

**ListView.vue**

- Grid container for CardView components
- Loading states and empty state handling
- Pagination support (load more)

**Field Renderers** (`components/field-renderers/`)

- Specialized components for each field type
- Consistent styling and behavior
- Type-specific formatting and validation

## 🌐 Backend (Netlify Functions)

### Main Function (`netlify/functions/notion-crud.js`)

**Purpose:** Serverless API proxy to Notion API
**Features:**

- CORS handling for cross-origin requests
- Request routing (GET, POST, PUT, DELETE)
- Authentication with Notion API
- Privacy field masking
- Error handling and response formatting

**API Endpoints:**

```javascript
GET /.netlify/functions/notion-crud              // Get all items
GET /.netlify/functions/notion-crud?id={id}      // Get single item
GET /.netlify/functions/notion-crud?info=true    // Get database info
POST /.netlify/functions/notion-crud             // Create item
PUT /.netlify/functions/notion-crud?id={id}      // Update item
DELETE /.netlify/functions/notion-crud?id={id}   // Delete item
```

**Privacy Features:**

- Automatically masks fields marked with "(Private)"
- Supports masking for email, phone, number, text, and URL fields
- Preserves data structure while hiding sensitive information

## 🔧 Utility Systems

### MappingUtils (`utils/mappingUtils.js`)

**Purpose:** Centralized mapping and formatting logic
**Features:**

- Field type to form input type mapping
- Icon mapping based on field names and types
- Currency formatting with international support
- Color mapping for Notion select options
- Placeholder text generation

**Key Functions:**

```javascript
mapNotionTypeToFormType(); // Type mapping
getFieldIcon(); // Icon selection
formatNumberBySchema(); // Currency formatting
getOptionClasses(); // Select option styling
generatePlaceholder(); // Placeholder text
```

### Performance & Caching

**Caching Strategy:**

- ItemService implements in-memory caching (5-minute TTL)
- Cache keys based on request parameters
- Automatic cache invalidation on mutations
- Parallel request handling for better performance

**Optimization Features:**

- Lazy loading of components and views
- Manual chunk splitting for better caching
- Parallel data loading (schema + items)
- Debounced form validation

## 🚀 Development Workflow

### Adding a New Field Type

1. **Update NotionMiddleware:**

   ```javascript
   // Add to flattenProperties()
   case 'new_type':
     result[key] = property.new_type?.value || ''
     break

   // Add to convertToNotionProperties()
   case 'new_type':
     properties[key] = { new_type: { value: value } }
     break
   ```

2. **Update MappingUtils:**

   ```javascript
   // Add to fieldTypeIconMap
   new_type: "pi pi-new-icon";

   // Add to notionTypeToFormTypeMap
   new_type: "new-input-type";
   ```

3. **Create Field Renderer:**

   ```vue
   <!-- components/field-renderers/NewTypeField.vue -->
   <template>
     <!-- Field-specific UI -->
   </template>
   ```

4. **Update FormFields.vue:**
   ```javascript
   // Add to field categorization logic
   const newTypeFields = computed(() =>
     getFormFieldsArray.value.filter((field) => field.type === "new_type")
   );
   ```

### Adding a New API Endpoint

1. **Update Netlify Function:**

   ```javascript
   // Add new case in switch statement
   case "PATCH":
     return await patchRecord(recordId, patchData, notionApiKey)
   ```

2. **Update ItemService:**

   ```javascript
   async patchItem(id, data) {
     return await this.apiRequest(`/notion-crud?id=${id}`, {
       method: 'PATCH',
       body: JSON.stringify(data)
     })
   }
   ```

3. **Update ItemStore:**
   ```javascript
   const patchItem = async (id, data) => {
     const response = await itemService.patchItem(id, data);
     // Handle response and update state
   };
   ```

### Debugging Tips

**Frontend Debugging:**

- Use Vue DevTools for component inspection
- Check Pinia store state in DevTools
- Console logs in services for API debugging
- Network tab for request/response inspection

**Backend Debugging:**

- Use `netlify dev` for local function testing
- Check Netlify function logs in dashboard
- Test API endpoints directly with curl/Postman
- Verify environment variables are set correctly

**Common Issues:**

- CORS errors: Check netlify.toml headers configuration
- Schema loading failures: Verify Notion API key and database ID
- Field rendering issues: Check NotionMiddleware transformations
- Validation errors: Review ValidationService rules

## 📝 Configuration

### Environment Variables

```bash
NOTION_API_KEY=your_notion_integration_key
NOTION_DATABASE_ID=your_database_id
```

### Netlify Configuration (`netlify.toml`)

- Function directory and build settings
- CORS headers for API access
- SPA routing configuration
- Environment variable management

### Vite Configuration (`frontend/vite.config.js`)

- Build optimization and chunking
- Development proxy for Netlify functions
- Component auto-import configuration
- Path aliases and build output

This architecture provides a solid foundation for building dynamic, schema-aware CRUD applications with Notion as the backend. The modular design makes it easy to extend with new field types, validation rules, and features while maintaining clean separation of concerns.
