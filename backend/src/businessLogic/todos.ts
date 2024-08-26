import { TodosAccess } from '../dataLayer/todosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info('Execute getTodosForUser...')
  return await todosAccess.getAllTodos(userId)
}

// CreateTodo Function
export async function createTodo(
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('Execute Creating Todo function...')

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const newItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: s3AttachmentUrl,
    ...newTodo
  }

  return await todosAccess.createTodoItem(newItem)
}

// UpdateTodo Function
export async function updateTodo(
  todoId: string,
  userId: string,
  todoUpdate: UpdateTodoRequest
): Promise<UpdateTodoRequest> {
  logger.info('Execute updateTodo...')
  return await todosAccess.updateTodoItem(todoId, userId, todoUpdate)
}

// DeleteTodo Function
export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<string> {
  logger.info('Execute deleteTodo...')
  return await todosAccess.deleteTodoItem(todoId, userId)
}

// createAttachmentPresignedUrl function
export async function createAttachmentPresignedUrl(
  userId: string,
  todoId: string
): Promise<string> {
  logger.info('Execute createAttachmentPresignedUrl...')
  logger.info(`createAttachmentPresignedUrl called by User: ${userId}`)

  return await attachmentUtils.getUploadUrl(todoId)
}
