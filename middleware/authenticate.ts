import express, { NextFunction } from 'express'

const authentication = (
  req: Express.Request,
  res: express.Response,
  next: NextFunction
) => {
  if (!req.client.authorized) {
    return res.status(401).json({ error: 'Invalid client certificate' })
  }
  next()
}

export { authentication }
