import { validationError, postEvent } from './test/helper'

describe('heartbeat', () => {
  describe('happy path', () => {
    it('should accept heartbeats', () => {
      return postEvent({ event: 'heartbeat', id: 'door1.localhost' }, 'door1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual('')
        })
    })

    it('should write the heartbeat', () => {})
  })

  describe('validation', () => {
    it('requires an id', () => {
      return postEvent({ event: 'heartbeat', id: null }, 'door1')
        .expect(400)
        .expect((res) => {
          expect(res.body.errors).toEqual([validationError('id', null)])
        })
    })

    it('must valid event type', () => {
      return postEvent(
        { event: 'not a heartbeat', id: 'door1.localhost' },
        'door1'
      )
        .expect(400)
        .expect((res) => {
          expect(res.body.errors).toEqual([
            validationError('event', 'not a heartbeat')
          ])
        })
    })
  })

  describe('authorization', () => {
    it('returns error when message id does not match cert', () => {
      return postEvent({ event: 'heartbeat', id: 'NotTheCorrectDoor' }, 'door1')
        .expect(403)
        .expect((res) => {
          expect(res.body.error).toEqual('Id does not match certificate')
        })
    })
  })
})
