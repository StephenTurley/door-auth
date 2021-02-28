import { NextFunction, Response, Request } from 'express'
import { DoorEvent } from '../door-event'

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  if (req?.body?.id !== req.client.getPeerCertificate().subject.CN) {
    const event: DoorEvent = req.body
    req.status = 'rejected'
    next()
  }
  req.status = 'allowed'
  next()
}
