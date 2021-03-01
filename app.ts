import fs from 'fs'
import https from 'https'
import express, { NextFunction, Response, Request } from 'express'
import bodyParser from 'body-parser'
import Config from './config'
import { authentication } from './middleware/authenticate'
import { authorize } from './middleware/authorize'
import { validate } from './middleware/validate'
import { Message, MessageEmitter, writer } from './middleware/writer'
import { DoorEvent } from './door-event'
import { TLSSocket } from 'node:tls'

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
  app.use(authentication())

  const processEvent = (req: Request, res: Response) => {
    const event: DoorEvent = req.body
    if (req.status === 'rejected') {
      return res.status(403).json({ status: req.status })
    }
    return res.json({ status: req.status })
  }

  app.post('/event', validate, authorize, writer(messageEmitter), processEvent)

  return https.createServer(
    {
      cert: fs.readFileSync(Config.cert),
      key: fs.readFileSync(Config.key),
      ca: fs.readFileSync(Config.ca),
      requestCert: true,
      rejectUnauthorized: false
    },
    app
  )
}
export default createServer
