import * as assert from 'assert'
import { Context } from 'egg'
import * as apiError from '../../../../app/errors/api_error'
import { app } from '../../bootstrap'

describe('test/app/extend/helper/errors.test.js', () => {
  let ctx: Context

  before(async () => {
    ctx = app.mockContext()
  })

  it('helper ApiError', async () => {
    assert(ctx.helper.ApiError === apiError.ApiError)
  })
})
