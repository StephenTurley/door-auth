import { DoorEvent } from './door-event'
import { Request, Response, NextFunction } from 'express'
import Config from './config'
import fs from 'fs'

export type Result = 'success' | 'failure'
export type Status = 'rejected' | 'allowed'
export type Message = { timestamp: Date; status: Status; event: DoorEvent }

export const write = (event: DoorEvent, status: Status): Result => {
  if (Config.faultInjection && Math.random() <= 0.1) {
    return 'failure'
  }
  try {
    const msg: Message = { timestamp: new Date(), status, event }

    fs.appendFileSync(Config.writePath, JSON.stringify(msg) + '\n')
    return 'success'
  } catch (err) {
    return 'failure'
  }
}
