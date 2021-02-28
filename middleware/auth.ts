import express, { NextFunction } from 'express'
import https from 'https'
import { DoorEvent } from '../door-event'

import { TLSSocket } from 'node:tls'

declare global {
  namespace Express {
    export interface Request {
      client: TLSSocket
      body?: DoorEvent
    }
  }
}

const tlsAuthentication = () => (
  req: Express.Request,
  res: express.Response,
  next: NextFunction
) => {
  if (!req.client.authorized) {
    return res.status(401).json({ error: 'Invalid client certificate' })
    // } else if (req?.body?.id !== req.client.getPeerCertificate().subject.CN) {
    //TODO move this check to authorize after validation
    // return res.status(401).json({ error: 'Id does not match certificate' })
  } else {
    next()
  }
}

export { tlsAuthentication }
