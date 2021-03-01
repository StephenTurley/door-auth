import { NextFunction, Response, Request } from 'express'
import { body, validationResult } from 'express-validator'

export const validate = [
  body('id').isLength({ min: 1 }),
  body('event').matches(/^heartbeat$|^enter$|^exit$/),
  body('payload.employeeId').if(body('event').equals('exit')).isInt({ min: 0 }),
  body('payload.employeeId')
    .if(body('event').equals('enter'))
    .isInt({ min: 0 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
