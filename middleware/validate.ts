import { NextFunction, Response, Request } from 'express'
import { body, check, validationResult } from 'express-validator'

export const validate = [
  body('id').isLength({ min: 1 }),
  body('event').matches(/^heartbeat$/),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
