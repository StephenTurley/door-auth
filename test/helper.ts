import createServer from '../app'
import fs from 'fs'
import request from 'supertest'
import { DoorEvent } from '../door-event'
import { MessageEmitter } from '../middleware/writer'

export function postEvent(event: any, door?: string, emitter?: MessageEmitter) {
  const req = request(createServer(emitter))
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
