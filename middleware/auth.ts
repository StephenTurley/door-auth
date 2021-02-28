import express, { NextFunction } from 'express'
import https from 'https'

declare global {
  namespace Express {
    export interface Request {
      client: { authorized: boolean }
    }
  }
}

const checkCert = () => (
  req: Express.Request,
  res: express.Response,
  next: NextFunction
) => {
  if (!req.client.authorized) {
    return res.status(401).send({ error: 'Invalid client certificate' })
  } else next()
}

export { checkCert }
