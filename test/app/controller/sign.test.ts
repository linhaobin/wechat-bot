import * as assert from 'assert'
import { Context } from 'egg'
import ApiError from '../../../app/errors/api_error'
import { app, httpRequest, httpRequestSignature } from '../bootstrap'

describe('sign/app/controller/sign.test.ts', () => {
  let ctx: Context

  before(async () => {
    ctx = app.mockContext()
  })

  it('sign-in', async () => {
    await ctx.service.user.initAdmin()

    const resp = await httpRequest()
      .post('/sign-in')
      .use(httpRequestSignature)
      .type('json')
      .send({
        username: app.config.admin.username,
        password: app.config.admin.initPassword
      })
      .expect(200)

    assert(resp.body && !resp.body.error)
  })

  it('sign-in 不传参数', async () => {
    const response = await httpRequest()
      .post('/sign-in')
      .use(httpRequestSignature)
      .type('json')
      .send()
      .expect(200)

    const result = response.body
    assert(result.error && result.error.code === ApiError.InvalidRequestParameter.code)
  })
})
