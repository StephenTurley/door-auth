import { postEvent } from './test/helper'

describe('app', () => {
  describe('authentication', () => {
    it('returns error if request lacks a cert', () => {
      return postEvent({ event: 'heartbeat', id: 'door2.localhost' })
        .expect(401)
        .expect((res) => {
          expect(res.body.error).toEqual('Invalid client certificate')
        })
    })

    it('returns error when message id does not match cert', () => {
      return postEvent({ event: 'heartbeat', id: 'NotTheCorrectDoor' }, 'door1')
        .expect(401)
        .expect((res) => {
          expect(res.body.error).toEqual('Id does not match certificate')
        })
    })
  })

  describe('heartbeat', () => {
    it('should accept heartbeats', () => {
      return postEvent(
        { event: 'heartbeat', id: 'door1.localhost' },
        'door1'
      ).expect(200)
    })
  })
})
