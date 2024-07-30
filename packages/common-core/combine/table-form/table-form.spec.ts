import { render, fireEvent } from '@testing-library/vue'
import { beforeEach, describe, it, expect } from 'vitest'
import TableForm from './table-form.vue'

describe('table-form', () => {
  beforeEach(() => {
    const RenderResult = render(TableForm)
  })

  it('render by config', () => {
    const config = {
      formItems: [{}],
    }
  })
})
