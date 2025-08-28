// Notion CRUD Service
// This service provides functions to interact with the Notion API for todo management.
// Requires a Notion integration token and database ID.

import { notionRequest } from './notionMiddleware'

// Use Vite env variable for Notion database ID
const NOTION_DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID

export async function getTodos() {
  return notionRequest(`/v1/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
  })
}

export async function createTodo(text) {
  return notionRequest('/v1/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Name: {
          title: [
            {
              text: { content: text },
            },
          ],
        },
        Done: {
          checkbox: false,
        },
      },
    }),
  })
}

export async function createClientEntry(databaseId, clientData) {
  return notionRequest('/v1/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        'Client Name': {
          title: [
            {
              text: { content: clientData.clientName },
            },
          ],
        },
        Email: {
          email: clientData.email,
        },
        'Project Details': {
          rich_text: [
            {
              text: { content: clientData.projectDetails },
            },
          ],
        },
        'Service Type': {
          select: { name: clientData.serviceType },
        },
        'Budget Range': {
          select: { name: clientData.budgetRange },
        },
        Status: {
          status: { name: clientData.status },
        },
        'Date Received': {
          date: { start: clientData.dateReceived },
        },
        'Follow-up Date': {
          date: { start: clientData.followUpDate },
        },
      },
    }),
  })
}

export async function updateTodo(id, updates) {
  return notionRequest(`/v1/pages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export async function deleteTodo(id) {
  // Notion does not support hard delete, so we set archived: true
  return notionRequest(`/v1/pages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ archived: true }),
  })
}
