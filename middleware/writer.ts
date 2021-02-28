import { DoorEvent } from '../door-event'
import { Request, Response, NextFunction } from 'express'
import Config from '../config'
import fs from 'fs'

type Result = 'success' | 'failure'

export const writer = (req: Request, res: Response, next: NextFunction) => {
  const event: DoorEvent = req.body
  try {
    fs.appendFileSync(Config.writePath, JSON.stringify(event) + '\n')
    next()
  } catch (err) {
    return res.status(503).json(err)
  }
}
