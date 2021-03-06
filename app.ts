import fs from 'fs'
import express from 'express'
import bodyParser from 'body-parser'
import Config from './config'
import { authentication } from './middleware/authenticate'
import { authorize } from './middleware/authorize'
import { validate } from './middleware/validate'
import { handleResponse } from './middleware/handler'
import { Message, MessageEmitter, writer } from './middleware/writer'
import { DoorEvent } from './door-event'
import { TLSSocket } from 'node:tls'
import { withHttps } from './https'
import EmployeeRepository, { InMemoryDb } from './employee-repository'

declare global {
  type Status = 'rejected' | 'allowed'
  namespace Express {
    export interface Request {
      client: TLSSocket
      status: Status
      body?: DoorEvent
    }
  }
}

const messageLogger: MessageEmitter = (msg: Message) =>
  fs.appendFileSync(Config.writePath, JSON.stringify(msg) + '\n')

const createServer = (
  messageEmitter: MessageEmitter = messageLogger,
  db: EmployeeRepository = new InMemoryDb()
) => {
  const app = express()
  app.use(bodyParser.json())
  app.use(authentication)

  app.post(
    '/event',
    validate,
    authorize(db),
    writer(messageEmitter),
    handleResponse
  )

  return withHttps(app)
}
export default createServer
