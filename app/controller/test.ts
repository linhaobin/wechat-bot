import { Controller } from 'egg'
import { v4 as uuid } from 'uuid'

export default class TestController extends Controller {
  /**
   * test
   *
   */
  public async test() {
    const { app, ctx } = this

    const id = uuid()
    const userId = 'userId'
    // const loginKey = app.wechatClient.loginKey(id)
    const result = await app.wechatClient.loginForPublish({ id, userId })
    // const result = await app.wechatClient.login(id, userId)

    ctx.success(result)
  }
}
