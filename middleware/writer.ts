import { DoorEvent } from '../door-event'
import { Request, Response, NextFunction } from 'express'
import Config from '../config'
import fs from 'fs'

export type Message = { timestamp: Date; status: Status; event: DoorEvent }
export type MessageEmitter = (message: Message) => void

const error = (res: Response) =>
  res.status(502).json({ error: 'failed to write' })

export const writer = (emitter: MessageEmitter) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Config.faultInjection && Math.random() <= 0.1) {
    return error(res)
  }
  try {
    const event: DoorEvent = req.body
    const msg: Message = { timestamp: new Date(), status: req.status, event }
    emitter(msg)
    next()
  } catch (err) {
    return error(res)
  }
}
