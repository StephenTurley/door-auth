import { postEvent } from './test/helper'

describe('app', () => {
  describe('authentication', () => {
    it('requires a cert', () => {
      return postEvent({ event: 'heartbeat', id: 'door2.localhost' })
        .expect(401)
        .expect((res) => {
          expect(res.body.error).toEqual('Invalid client certificate')
        })
    })
    it('requires a cert signed by the correct CA', () => {
      return postEvent(
        { event: 'heartbeat', id: 'door1.localhost' },
        'bogus-door1'
      )
        .expect(401)
        .expect((res) => {
          expect(res.body.error).toEqual('Invalid client certificate')
        })
    })
  })

  describe('heartbeat', () => {
    describe('happy path', () => {
      it('should accept heartbeats', () => {
        return postEvent(
          { event: 'heartbeat', id: 'door1.localhost' },
          'door1'
        ).expect(200)
      })
    })

    describe('authorization', () => {
      // it('returns error when message id does not match cert', () => {
      //   return postEvent({ event: 'heartbeat', id: 'NotTheCorrectDoor' }, 'door1')
      //     .expect(403)
      //     .expect((res) => {
      //       expect(res.body.error).toEqual('Id does not match certificate')
      //     })
      // })
    })
  })
})
