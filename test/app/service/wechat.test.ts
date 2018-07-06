import * as assert from 'assert'
import { Context } from 'egg'
import { app } from '../bootstrap'

describe('test/app/service/wechat.test.js', () => {
  let ctx: Context

  before(async () => {
    ctx = app.mockContext()
  })

  it('scan', async () => {
    const user = await ctx.service.user.getUserByUsername(app.config.admin.username)

    if (!user) {
      assert(false, '没有用户')
      return
    }

    const result = await ctx.service.wechat.login(user.id)

    assert(result && result.qrcode)

    console.info('wait 50s')
    await new Promise(resolve => setTimeout(resolve, 50 * 1000))
  })
})
