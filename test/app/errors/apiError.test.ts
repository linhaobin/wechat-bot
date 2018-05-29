import * as assert from 'assert'
import ApiError from '../../../app/errors/api_error'

describe('test/app/errors/api_error.test.ts', () => {
  it('new ApiError', async () => {
    const error = new ApiError(1, 'msg')

    assert(error.code === 1)
    assert(error.message === 'msg')
  })

  it('copy', async () => {
    const error = new ApiError(1, 'msg')
    const copyError = error.copy()

    assert(error !== copyError)
    assert(error.code === 1)
    assert(error.message === 'msg')
  })

  it('assert', async () => {
    const error = new ApiError(1, 'msg')

    try {
      error.assert(false)

      // 应该不会执行
      assert(false)
    } catch (err) {
      assert(err === error)
    }
  })
})
