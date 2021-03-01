import createServer from '../app'
import fs from 'fs'
import request from 'supertest'
import { DoorEvent } from '../door-event'
import { MessageEmitter } from '../middleware/writer'
import EmployeeRepository, { InMemoryDb } from '../employee-repository'

const testDb = () => {
  const db = new InMemoryDb()
  db.setEmployee({ id: 1, policies: [{ id: 'door1' }] })
  return db
}

export function postEvent(
  event: any,
  door?: string,
  emitter?: MessageEmitter,
  db: EmployeeRepository = testDb()
) {
  const req = request(createServer(emitter, db))
    .post('/event')
    .trustLocalhost()
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send(event)

  if (door) {
    return req
      .cert(fs.readFileSync(`certs/${door}-crt.pem`))
      .key(fs.readFileSync(`certs/${door}-key.pem`))
  }
  return req
}

export function validationError(field: string, value: any) {
  return {
    location: 'body',
    msg: 'Invalid value',
    param: field,
    value: value
  }
}
