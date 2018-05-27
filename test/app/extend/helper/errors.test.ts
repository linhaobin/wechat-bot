import * as assert from 'assert'
import { Context } from 'egg'
import { app } from 'egg-mock/bootstrap'
import * as apiError from '../../../../app/errors/apiError'

describe('test/app/extend/helper/errors.test.js', () => {
  let ctx: Context

  before(async () => {
    ctx = app.mockContext()
  })

  it('helper assert', async () => {
    assert(ctx.helper.assert === apiError.assert)
  })

  it('helper ApiError', async () => {
    assert(ctx.helper.ApiError === apiError.ApiError)
  })
})
