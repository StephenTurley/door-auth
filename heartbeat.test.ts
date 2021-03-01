import { Heartbeat } from './door-event'
import { Message, MessageEmitter } from './middleware/writer'
import { validationError, postEvent } from './test/helper'

describe('heartbeat', () => {
  describe('happy path', () => {
    const event: Heartbeat = { event: 'heartbeat', id: 'door1.localhost' }
    it('should accept heartbeats', () => {
      return postEvent(event, 'door1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'allowed' })
        })
    })

    it('logs a message', (done) => {
      const emitter: MessageEmitter = jest.fn()
      const expected: Message = {
        timestamp: expect.any(Date),
        status: 'allowed',
        event: event
      }
      postEvent(event, 'door1', emitter).end(() => {
        expect(emitter).toHaveBeenCalledWith(expected)
        done()
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
