import app from './app'
import request from 'supertest'

describe('app', () => {
  it('should say hello', () => {
    return request(app).get('/').expect(200).expect('Content-Type', /json/)
  })
})
