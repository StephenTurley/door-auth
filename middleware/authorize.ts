import { NextFunction, Response, Request } from 'express'
import { DoorEvent } from '../door-event'
import { write } from '../writer'

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  if (req?.body?.id !== req.client.getPeerCertificate().subject.CN) {
    const event: DoorEvent = req.body
    write(event, 'rejected')
    return res.status(403).json({ error: 'Id does not match certificate' })
  }
  next()
}
