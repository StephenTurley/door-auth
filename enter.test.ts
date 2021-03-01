import { Enter } from './door-event'
import { InMemoryDb } from './employee-repository'
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

  describe('authorization', () => {
    it('returns Forbidden when sending an ID for another door', () => {
      const event = { event: 'enter', id: 'door22', payload: { employeeId: 1 } }
      return postEvent(event, 'door1')
        .expect(403)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'rejected' })
        })
    })

    it('returns Forbidden when employee is not in db', () => {
      const event = { event: 'enter', id: 'door1', payload: { employeeId: 99 } }
      return postEvent(event, 'door1')
        .expect(403)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'rejected' })
        })
    })

    it('returns Forbidden when does not have access to the door', () => {
      const db: InMemoryDb = new InMemoryDb()
      db.setEmployee({ id: 99, policies: [{ id: 'door2' }] })

      const event = { event: 'enter', id: 'door1', payload: { employeeId: 99 } }
      return postEvent(event, 'door1', jest.fn(), db)
        .expect(403)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'rejected' })
        })
    })
  })
})
