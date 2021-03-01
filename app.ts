import express, { NextFunction, Response, Request } from 'express'
import bodyParser from 'body-parser'
import { authentication } from './middleware/authenticate'
import { authorize } from './middleware/authorize'
import { validate } from './middleware/validate'
import { writer } from './middleware/writer'
import { createServer } from './server'
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

app.post('/event', validate, authorize, writer, processEvent)

const server = createServer(app)

export default server
