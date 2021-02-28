import { DoorEvent } from '../door-event'
import { Request, Response, NextFunction } from 'express'
import Config from '../config'
import fs from 'fs'

export const writer = (req: Request, res: Response, next: NextFunction) => {
  const event: DoorEvent = req.body

  if (Config.faultInjection && Math.random() <= 0.1) {
    return res.status(503).json({ error: 'Failed to write' })
  }

  try {
    fs.appendFileSync(Config.writePath, JSON.stringify(event) + '\n')
    next()
  } catch (err) {
    return res.status(503).json({ error: 'Failed to write' })
  }
}
