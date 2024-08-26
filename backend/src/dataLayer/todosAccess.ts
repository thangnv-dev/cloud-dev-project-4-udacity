import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
// import { TodoUpdate } from '../models/TodoUpdate'
var AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosIndex = process.env.INDEX_NAME
  ) {}

  // GetAllTodos
  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Execute Get All Todos Function...')

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todosIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  // CreateTodoItem
  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('Execute CreateTodoItem function...')
    const result = await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise()
    logger.info('Item Created: ', result)
    return todoItem as TodoItem
  }

  // updateTodoItem
  async updateTodoItem(
    todoId: string,
    userId: string,
    todoUpdate: TodoUpdate
  ): Promise<TodoUpdate> {
    logger.info('Execute updateTodoItem...')

    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          name: todoUpdate.name,
          ':dueDate': todoUpdate.dueDate,
          ':done': todoUpdate.done
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return todoUpdate
  }

  // DeleteTodoItem
  async deleteTodoItem(todoId: string, userId: string): Promise<string> {
    logger.info('Execute DeleteTodoItem...')

    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        }
      })
      .promise()

    return todoId
  }

  //updateTodoAttachmentUrl
  async updateTodoAttachmentUrl(
    todoId: string,
    userId: string,
    attachmentUrl: string
  ): Promise<void> {
    logger.info('Execute updateTodoAttachmentUrl...')

    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
  }
}
