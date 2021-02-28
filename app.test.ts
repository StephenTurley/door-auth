import server from './app'
import request from 'supertest'

describe('app', () => {
  it('return a 401 if the client does not provide a cert', () => {
    return request(server)
      .get('/')
      .trustLocalhost()
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toEqual('Invalid client certificate')
      })
  })
})
