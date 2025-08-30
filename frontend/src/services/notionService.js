// Notion CRUD Service
// This service provides generic functions to interact with the Notion API for database operations.
// Requires a Notion integration token and database ID.

import { notionRequest } from './notionMiddleware'

// Use Vite env variable for Notion database ID
const NOTION_DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID
console.log(NOTION_DATABASE_ID)
export async function queryDatabase(databaseId = NOTION_DATABASE_ID) {
  return notionRequest(`/v1/databases/${databaseId}/query`, {
    method: 'POST',
  })
}

export async function createPage(databaseId, properties) {
  return notionRequest('/v1/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
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

export async function updatePage(id, updates) {
  return notionRequest(`/v1/pages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export async function archivePage(id) {
  // Notion does not support hard delete, so we set archived: true
  return notionRequest(`/v1/pages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ archived: true }),
  })
}

// Legacy function names for backward compatibility
export const getTodos = () => queryDatabase()
export const createTodo = (text) =>
  createPage(NOTION_DATABASE_ID, {
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
  })
export const updateTodo = updatePage
export const deleteTodo = archivePage
