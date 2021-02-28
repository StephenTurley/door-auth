import express, { NextFunction, Response, Request } from 'express'
import bodyParser from 'body-parser'
import { authentication } from './middleware/authenticate'
import { authorize } from './middleware/authorize'
import { validate } from './middleware/validate'
import { createServer } from './server'
import { DoorEvent } from './door-event'
import { TLSSocket } from 'node:tls'

declare global {
  namespace Express {
    export interface Request {
      client: TLSSocket
      body?: DoorEvent
    }
  }
}

const app = express()

app.use(bodyParser.json())
app.use(authentication())

const processEvent = (req: Request, res: Response) => {
  return res.json('')
}

app.post('/event', validate, authorize, processEvent)

const server = createServer(app)

export default server
