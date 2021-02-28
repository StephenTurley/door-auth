import express, { NextFunction, Response, Request } from 'express'
import { authentication } from './middleware/auth'
import { createServer } from './server'
import { body, validationResult } from 'express-validator'
import { DoorEvent } from './door-event'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())
app.use(authentication())

const processEvent = (req: Request<DoorEvent>, res: Response) => {
  return res.json()
}

app.post(
  '/event',
  body('id').isLength({ min: 1 }),
  body('event').matches(/^heartbeat$/),
  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    return processEvent(req as Request<DoorEvent>, res)
  }
)

const server = createServer(app)

export default server
