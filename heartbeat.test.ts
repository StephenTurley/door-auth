import { validationError, postEvent } from './test/helper'

describe('heartbeat', () => {
  describe('happy path', () => {
    it('should accept heartbeats', () => {
      return postEvent({ event: 'heartbeat', id: 'door1.localhost' }, 'door1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'allowed' })
        })
    })
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
    it('returns Forbidden when sending an ID for another door', () => {
      return postEvent({ event: 'heartbeat', id: 'NotDoor1' }, 'door1')
        .expect(403)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'rejected' })
        })
    })
  })
})
