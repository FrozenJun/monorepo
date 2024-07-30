import { ObserverCls } from './observer'
import { expect, it, describe, beforeEach } from 'vitest'

describe('observer', () => {
  let observer: ObserverCls

  beforeEach(() => {
    observer = new ObserverCls()
  })

  it('subscribe func', () => {
    let count = 0
    observer.subscribe('subscribe', () => count++)
    observer.trigger('subscribe')
    observer.trigger('subscribe')
    expect(count).equal(2)
  })

  it('pass args', () => {
    let count = 0
    observer.subscribe('subscribe', (v: number) => (count = v))
    observer.trigger('subscribe', 2)
    expect(count).equal(2)
  })

  it('offline func', () => {
    let count = 0
    observer.trigger('subscribe')
    observer.subscribe('subscribe', () => count++)
    observer.trigger('subscribe')
    expect(count).equal(2)
  })
})
