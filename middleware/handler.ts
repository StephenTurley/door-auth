import { Response, Request } from 'express'

export const handleResponse = (req: Request, res: Response) => {
  if (req.status === 'rejected') {
    return res.status(403).json({ status: req.status })
  }
  return res.json({ status: req.status })
}
