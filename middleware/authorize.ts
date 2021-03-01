import EmployeeRepository from '../employee-repository'
import { NextFunction, Response, Request } from 'express'
import { DoorEvent, Enter, Exit } from '../door-event'
import * as _ from 'lodash'

const isAllowed = (event: Enter | Exit, db: EmployeeRepository): boolean => {
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
  } else if (event.event === 'enter' || event.event === 'exit') {
    req.status = isAllowed(event, db) ? 'allowed' : 'rejected'
  } else {
    req.status = 'allowed'
  }
  next()
}
