import { Controller } from 'egg'
// import * as Joi from 'joi'

// import { ApiError } from '../errors/api_error'

export default class WechatController extends Controller {
  /**
   * 登入
   */
  public async scan() {
    const { ctx } = this

    const session = await ctx.getSession()

    const result = await ctx.service.wechat.scan(session.userId)

    ctx.success(result)
  }

  /**
   * 获取当前用户wechat
   */
  public async getWechat() {
    const { ctx } = this

    const session = await ctx.getSession()

    const wechats = await ctx.service.wechat.getWechatByUserId(session.userId)

    ctx.success({ wechats })
  }

  /**
   * 重启
   */
  // public async restart() {
  //   const { ctx } = this

  //   const body: { sessionId: string } = ctx.request.body

  //   const schema = Joi.object().keys({
  //     sessionid: Joi.string().required()
  //   })
  //   const { sessionId } = await schema.validate(body)

  //   if (!sessionId) throw ApiError.InvalidRequestParameter.setDetails('invalid sessionId')

  //   const session = await ctx.getSession()

  //   await ctx.service.wechat.restart(session.userId, sessionId)

  //   ctx.success()
  // }
}
