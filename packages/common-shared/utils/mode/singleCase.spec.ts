import { expect, it } from 'vitest'
import { executeOnce, getSingle } from './singleCase'

it('getSingle', () => {
  let count = 0
  const newSomething = () => {
    count++
    return {}
  }
  const newSomethingSingle = getSingle(newSomething)
  newSomethingSingle()
  newSomethingSingle()
  expect(count).equal(1)
})

it('executeOnce', () => {
  let count = 0
  const add = () => count++
  const addSingle = executeOnce(add)
  addSingle()
  addSingle()
  expect(count).equal(1)
})
