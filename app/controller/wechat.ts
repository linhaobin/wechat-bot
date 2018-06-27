import { Controller } from 'egg'

export default class WechatController extends Controller {

  /**
   * 登入
   */
  public async login() {
    const { ctx } = this

    const session = await ctx.getSession()

    const result = await ctx.service.wechat.login(session.userId)

    ctx.success(result)
  }
}
