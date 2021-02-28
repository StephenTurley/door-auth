import server from './app'
import fs from 'fs'
import request from 'supertest'

describe('app', () => {
  describe('authentication', () => {
    it('returns error if request lacks a cert', () => {
      return request(server)
        .post('/event')
        .trustLocalhost()
        .send({ event: 'heartbeat', id: 'door2.localhost' })
        .set('Accept', 'application/json')
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.error).toEqual('Invalid client certificate')
        })
    })

    it('returns error when message id does not match cert', () => {
      return request(server)
        .post('/event')
        .trustLocalhost()
        .cert(fs.readFileSync('certs/door1-crt.pem'))
        .key(fs.readFileSync('certs/door1-key.pem'))
        .send({ event: 'heartbeat', id: 'door2.localhost' })
        .set('Accept', 'application/json')
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.error).toEqual('Id does not match certificate')
        })
    })
  })

  describe('heartbeat', () => {
    it('should accept heartbeats', () => {
      return request(server)
        .post('/event')
        .trustLocalhost()
        .cert(fs.readFileSync('certs/door1-crt.pem'))
        .key(fs.readFileSync('certs/door1-key.pem'))
        .send({ event: 'heartbeat', id: 'door1.localhost' })
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
    })
  })
})
