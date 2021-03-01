import { Enter } from './door-event'
import { Message, MessageEmitter } from './middleware/writer'
import { validationError, postEvent } from './test/helper'

describe('enter', () => {
  describe('happy path', () => {
    const event: Enter = {
      event: 'enter',
      id: 'door1',
      payload: { employeeId: 1 }
    }

    it('should accept enter', () => {
      return postEvent(event, 'door1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'allowed' })
        })
    })

    it('logs a message', (done) => {
      const emitter: MessageEmitter = jest.fn()

      postEvent(event, 'door1', emitter).end(() => {
        const expected: Message = {
          timestamp: expect.any(Date),
          status: 'allowed',
          event: event
        }
        expect(emitter).toHaveBeenCalledWith(expected)
        done()
      })
    })
  })

  describe('validation', () => {
    it('requires an id', () => {
      const event = {
        event: 'enter',
        id: null,
        payload: { employeeId: 1 }
      }

      return postEvent(event, 'door1')
        .expect(400)
        .expect((res) => {
          expect(res.body.errors).toEqual([validationError('id', null)])
        })
    })

    it('must valid event type', () => {
      const event = {
        event: 'not an enter',
        id: 'door1',
        payload: { employeeId: 1 }
      }
      return postEvent(event, 'door1')
        .expect(400)
        .expect((res) => {
          expect(res.body.errors).toEqual([
            validationError('event', 'not an enter')
          ])
        })
    })

    it('must have valid employeeId', () => {
      const event = {
        event: 'enter',
        id: 'door1',
        payload: { employeeId: -1 }
      }
      return postEvent(event, 'door1')
        .expect(400)
        .expect((res) => {
          expect(res.body.errors).toEqual([
            validationError('payload.employeeId', -1)
          ])
        })
    })
  })
})
