import { NextFunction, Response, Request } from 'express'

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  if (req?.body?.id !== req.client.getPeerCertificate().subject.CN) {
    return res.status(403).json({ error: 'Id does not match certificate' })
  }
  next()
}
