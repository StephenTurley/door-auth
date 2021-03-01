import { Enter } from './door-event'
import { validationError, postEvent } from './test/helper'

describe('enter', () => {
  describe('happy path', () => {
    const event: Enter = {
      event: 'enter',
      id: 'door1.localhost',
      payload: { employeeId: 1 }
    }

    it('should accept enter', () => {
      return postEvent(event, 'door1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'allowed' })
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
        id: 'door1.localhost',
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
        id: 'door1.localhost',
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
