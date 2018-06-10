import * as assert from 'assert'
import { Context, Session } from 'egg'
import ApiError from '../../../app/errors/api_error'
import { User } from '../../../app/model/user'
import { app, httpRequest, httpRequestSignature } from '../bootstrap'

describe('sign/app/controller/sign.test.ts', () => {
  let ctx: Context

  before(async () => {
    ctx = app.mockContext()
  })

  it('sign in and get user', async () => {
    await ctx.service.user.initAdmin()

    //
    const signInResp = await httpRequest()
      .post('/sign/sign-in')
      .use(httpRequestSignature)
      .type('json')
      .send({
        username: app.config.admin.username,
        password: app.config.admin.initPassword
      })
      .expect(200)

    assert(signInResp.body && !signInResp.body.error)
    const session: Session = signInResp.body
    assert(session.accessToken)
    assert(session.id)
    assert(session.expire)
    assert(session.expireAt)

    // get user
    const getUserResp = await httpRequest()
      .post('/sign/get-user')
      .use(
        httpRequestSignature({
          sessionId: session.id,
          accessToken: session.accessToken
        })
      )
      .type('json')
      .send({
        username: app.config.admin.username,
        password: app.config.admin.initPassword
      })
      .expect(200)

    assert(getUserResp.body && !getUserResp.body.error)
    const user: User = getUserResp.body

    assert(user.username)
    assert(user.password)
  })

  it('sign-in 不传参数', async () => {
    const response = await httpRequest()
      .post('/sign/sign-in')
      .use(httpRequestSignature)
      .type('json')
      .send()
      .expect(200)

    const result = response.body
    assert(result.error && result.error.code === ApiError.InvalidRequestParameter.code)
  })
})
