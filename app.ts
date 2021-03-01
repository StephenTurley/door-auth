import fs from 'fs'
import express from 'express'
import bodyParser from 'body-parser'
import Config from './config'
import { authentication } from './middleware/authenticate'
import { authorize } from './middleware/authorize'
import { validate } from './middleware/validate'
import { Message, MessageEmitter, writer } from './middleware/writer'
import { DoorEvent } from './door-event'
import { TLSSocket } from 'node:tls'
import { handleResponse } from './middleware/handler'
import { withHttps } from './https'

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

const createServer = (messageEmitter: MessageEmitter = messageLogger) => {
  const app = express()
  app.use(bodyParser.json())
  app.use(authentication)

  app.post(
    '/event',
    validate,
    authorize,
    writer(messageEmitter),
    handleResponse
  )

  return withHttps(app)
}
export default createServer
