import server from '../app'
import fs from 'fs'
import request from 'supertest'
import { DoorEvent } from '../door-event'

export function postEvent(event: any, door?: string) {
  const req = request(server)
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
