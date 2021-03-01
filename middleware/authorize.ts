import EmployeeRepository from '../employee-repository'
import { NextFunction, Response, Request } from 'express'
import { DoorEvent, Enter } from '../door-event'
import * as _ from 'lodash'

const isAllowed = (event: Enter, db: EmployeeRepository): boolean => {
  return !!_.find(db.getPolicies(event.payload.employeeId), { id: event.id })
}

export const authorize = (db: EmployeeRepository) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const event: DoorEvent = req.body
  if (req?.body?.id !== req.client.getPeerCertificate().subject.CN) {
    req.status = 'rejected'
    next()
  } else if (event.event === 'enter') {
    req.status = isAllowed(event, db) ? 'allowed' : 'rejected'
    next()
  } else {
    req.status = 'allowed'
    next()
  }
}
