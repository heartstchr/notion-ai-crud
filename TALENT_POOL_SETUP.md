# Talent Pool / Job Board Setup Guide

This guide will help you set up your dynamic Talent Pool application that automatically adapts to your Notion database schema.

## 🚀 Features

- **Dynamic Form Generation**: Forms automatically adapt to your Notion database columns
- **Full CRUD Operations**: Create, Read, Update, Delete talent profiles
- **Real-time Schema Detection**: Changes in Notion database reflect immediately in the application
- **Responsive Design**: Works perfectly on desktop and mobile
- **Type-aware Fields**: Smart field types (email, phone, URL, multi-select, etc.)
- **Validation**: Client-side validation based on field types
- **Caching**: Optimized performance with intelligent caching

## 📋 Prerequisites

1. **Notion Account**: You need a Notion workspace
2. **Netlify Account**: For hosting the functions (proxy server)
3. **Node.js**: Version 16 or higher

## 🔧 Setup Instructions

### Step 1: Create Your Notion Database

1. Go to your Notion workspace
2. Create a new database with these **recommended columns** (you can add more):

   | Column Name        | Type         | Description                        |
   | ------------------ | ------------ | ---------------------------------- |
   | Name               | Title        | Full name of the talent            |
   | Email              | Email        | Contact email                      |
   | Phone              | Phone        | Contact phone number               |
   | Skills             | Multi-select | Technical skills (comma-separated) |
   | Portfolio Link     | URL          | Link to portfolio/website          |
   | Experience Level   | Select       | Junior, Mid, Senior, Lead          |
   | Location           | Rich Text    | Current location                   |
   | Available          | Checkbox     | Available for hire                 |
   | Salary Expectation | Number       | Expected salary                    |
   | Notes              | Rich Text    | Additional notes                   |

3. **Important**: The application will automatically detect and adapt to ANY columns you create in your Notion database!

### Step 2: Create Notion Integration

1. Go to [Notion Developers](https://developers.notion.com/)
2. Click "New Integration"
3. Fill in the details:
   - Name: "Talent Pool Manager"
   - Logo: (optional)
   - Associated workspace: Select your workspace
4. Click "Submit"
5. Copy the **Internal Integration Token** (starts with `secret_`)

### Step 3: Share Database with Integration

1. Open your Notion database
2. Click the "Share" button (top right)
3. Click "Invite" and search for your integration name
4. Select your integration and click "Invite"
5. Copy the **Database ID** from the URL (the long string after the last `/` and before `?`)

### Step 4: Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file with your values:

   ```env
   # Notion API Configuration
   NOTION_API_KEY=secret_your_notion_integration_token_here
   NOTION_DATABASE_ID=your_database_id_here

   # SMTP Configuration for Email Notifications (Optional)
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password_here
   ```

### Step 5: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 6: Development Setup

1. **Frontend Development** (Vue.js):

   ```bash
   cd frontend
   npm run dev
   ```

2. **Netlify Functions Development**:
   ```bash
   # In the root directory
   netlify dev
   ```

### Step 7: Deploy to Netlify

1. **Build the frontend**:

   ```bash
   cd frontend
   npm run build
   cd ..
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Set the build command: `cd frontend && npm run build`
   - Set the publish directory: `public`
   - Add environment variables in Netlify dashboard:
     - `NOTION_API_KEY`
     - `NOTION_DATABASE_ID`
     - `SMTP_USER` (optional)
     - `SMTP_PASS` (optional)

## 🎯 Usage Guide

### Adding New Database Columns

1. Go to your Notion database
2. Add a new column with any supported type:

   - **Title**: Main identifier
   - **Rich Text**: Multi-line text
   - **Email**: Email addresses
   - **Phone**: Phone numbers
   - **URL**: Website links
   - **Number**: Numeric values
   - **Select**: Single choice dropdown
   - **Multi-select**: Multiple choice tags
   - **Checkbox**: Boolean values
   - **Date**: Date picker
   - **Status**: Workflow status

3. Refresh the application - the new field will automatically appear in the form!

### Form Field Types

The application automatically maps Notion column types to appropriate form fields:

- **Title/Rich Text** → Text input/Textarea
- **Email** → Email input with validation
- **Phone** → Tel input with formatting
- **URL** → URL input with validation
- **Number** → Number input
- **Select/Status** → Dropdown
- **Multi-select** → Tag selector with custom input
- **Checkbox** → Checkbox
- **Date** → Date picker

### API Endpoints

The application provides these API endpoints:

- `GET /.netlify/functions/get-database-schema` - Get database schema
- `GET /.netlify/functions/talent-crud` - Get all talent profiles
- `GET /.netlify/functions/talent-crud?id={id}` - Get specific talent
- `POST /.netlify/functions/talent-crud` - Create new talent
- `PUT /.netlify/functions/talent-crud?id={id}` - Update talent
- `DELETE /.netlify/functions/talent-crud?id={id}` - Delete talent

## 🔍 Troubleshooting

### Common Issues

1. **"Notion API key missing" error**:

   - Check that your environment variables are set correctly
   - Ensure the integration token starts with `secret_`

2. **"Database not found" error**:

   - Verify the database ID is correct
   - Ensure the integration has access to the database (check sharing settings)

3. **Form fields not appearing**:

   - Check that your database has columns defined
   - Try refreshing the schema using the "Refresh Schema" button

4. **CORS errors in development**:
   - Make sure you're using `netlify dev` for local development
   - Check that the functions are running on the correct port

### Debug Mode

Enable debug logging by adding to your environment:

```env
DEBUG=true
```

## 🚀 Advanced Features

### Custom Validation

The application includes intelligent validation based on field types:

- Email format validation
- URL format validation
- Phone number format validation
- Required field validation

### Caching

The application uses intelligent caching to improve performance:

- Schema caching (5 minutes)
- Talent list caching (5 minutes)
- Individual talent caching (5 minutes)

### Responsive Design

The application is fully responsive and works great on:

- Desktop computers
- Tablets
- Mobile phones

## 📚 API Reference

### TalentService Methods

```javascript
import talentService from "./services/talentService.js";

// Get database schema
const schema = await talentService.getDatabaseSchema();

// Get all talents
const talents = await talentService.getAllTalents({ pageSize: 20 });

// Get specific talent
const talent = await talentService.getTalent("talent-id");

// Create talent
const newTalent = await talentService.createTalent(formData);

// Update talent
const updatedTalent = await talentService.updateTalent("talent-id", formData);

// Delete talent
await talentService.deleteTalent("talent-id");

// Generate form fields from schema
const fields = talentService.generateFormFields(schema);

// Validate form data
const validation = talentService.validateFormData(formData, schema);
```

## 🎨 Customization

### Styling

The application uses scoped CSS. You can customize the appearance by modifying:

- `/frontend/src/components/TalentPool.vue` - Main component styles
- `/frontend/src/App.vue` - Global navigation styles
- `/frontend/src/assets/main.css` - Global styles

### Adding New Field Types

To add support for new Notion field types:

1. Update the `mapNotionTypeToFormType` method in `talentService.js`
2. Add the corresponding form field in `TalentPool.vue`
3. Update the `convertToNotionProperties` helper in `talent-crud.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Need help?** Check the troubleshooting section above or create an issue in the repository.
