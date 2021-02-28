import { validationError, postEvent } from './test/helper'

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
})
