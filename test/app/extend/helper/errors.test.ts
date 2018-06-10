import * as assert from 'assert'
import { Application, Context } from 'egg'
import mock, { BaseMockApplication } from 'egg-mock'
import * as apiError from '../../../../app/errors/api_error'

describe('test/app/extend/helper/errors.test.js', () => {
  let app: BaseMockApplication<Application, Context>
  let ctx: Context

  before(async () => {
    app = mock.app()
    ctx = app.mockContext()
  })

  it('helper ApiError', async () => {
    assert(ctx.helper.ApiError === apiError.ApiError)
  })
})
