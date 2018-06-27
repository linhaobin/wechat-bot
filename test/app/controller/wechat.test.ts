import * as assert from 'assert'
import { Context } from 'egg'
import { app, getSession, httpRequest, httpRequestSignature } from '../bootstrap'

describe('sign/app/controller/wechat.test.ts', () => {
  let ctx: Context

  before(async () => {
    ctx = app.mockContext()
  })

  it('login', async () => {
    const session = await getSession()

    // get user
    const resp = await httpRequest()
      .get('/wechat/login')
      .use(
        httpRequestSignature({
          sessionId: session.id,
          accessToken: session.accessToken
        })
      )
      .type('json')
      .expect(200)

    const result = resp.body
    assert(result && !result.error)

    assert(result.qrcode)
    assert(result.status)
  })
})
