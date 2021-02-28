import { DoorEvent } from '../door-event'
import { Request, Response, NextFunction } from 'express'
import Config from '../config'
import fs from 'fs'

export type Message = { timestamp: Date; status: Status; event: DoorEvent }

export const writer = (req: Request, res: Response, next: NextFunction) => {
  if (Config.faultInjection && Math.random() <= 0.1) {
    return res.status(500).json({ error: 'failed to write' })
  }
  try {
    const event: DoorEvent = req.body
    const msg: Message = { timestamp: new Date(), status: req.status, event }
    fs.appendFileSync(Config.writePath, JSON.stringify(msg) + '\n')
    next()
  } catch (err) {
    return res.status(500).json({ error: 'failed to write' })
  }
}
