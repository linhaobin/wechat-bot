import { Service } from 'egg'
// import { v4 as uuid } from 'uuid'
import { Message } from 'wechaty'

import ApiError from '../errors/api_error'
import { WechatStatus } from '../model/wechat'
import { WechatSessionStatus } from '../model/wechat_session'

export default class WechatService extends Service {
  /**
   * 扫码登录
   */
  public async scan(userId: string) {
    const { app } = this

    const ObjectId = app.mongoose.Types.ObjectId
    const id = new ObjectId().toHexString()
    const result = await app.wechatClient.loginForPublish({ id, userId })

    return result
  }

  /**
   * handleLogin 处理登录
   *
   * @param wechaty
   * @param wechatUser
   */
  public async login({
    wechatSessionId,
    userId,
    wechatUserId,
    name
  }: {
    wechatSessionId: string
    userId: string
    wechatUserId: string
    name: string
  }) {
    const { app, ctx } = this
    const ObjectId = app.mongoose.Types.ObjectId

    let wechat = await this.getWechatByWechatUserId(userId, wechatUserId)

    // save wechat
    if (!wechat) {
      wechat = new ctx.model.Wechat()
      wechat._id = new ObjectId()
      wechat.user_id = new ObjectId(userId)
      wechat.wechatUserId = wechatUserId
      wechat.name = name
    }
    wechat.session_id = new ObjectId(wechatSessionId)
    wechat.name = name
    wechat.status = WechatStatus.Login

    let wechatSession = await this.getWechatSessionById(wechatSessionId)

    if (!wechatSession) {
      wechatSession = new ctx.model.WechatSession()
      wechatSession._id = new ObjectId(wechatSessionId)
      wechatSession.user_id = new ObjectId(userId)
      wechatSession.wechat_id = wechat._id
      wechatSession.wechatUserId = wechatUserId
      wechatSession.loginTime = Date.now()
    }
    wechatSession.status = WechatSessionStatus.Login

    // save wechat session

    await Promise.all([wechat.save(), wechatSession.save()])
  }

  /**
   * handleLogout 处理登出
   *
   * @param wechaty
   */
  public async logout({ wechatSessionId, userId }: { wechatSessionId: string; userId: string }) {
    const wechatSession = await this.ctx.model.WechatSession.findById(wechatSessionId)

    if (!wechatSession) return

    // 判断是否对应userId
    if (userId !== wechatSession.user_id.toHexString()) {
      throw ApiError.PermissionDenied
    }

    // 更新 wechat session 的状态、登出时间
    wechatSession.status = WechatSessionStatus.Logout
    wechatSession.logoutTime = Date.now()
    await wechatSession.save()

    const wechat = await this.ctx.model.Wechat.findOne({ session_id: wechatSession._id })
    if (!wechat) return

    // 更新wechat状态
    wechat.status = WechatStatus.Logout

    await wechat.save()
  }

  /**
   * restart
   * @param userId 重新启动
   * @param sessionId
   */
  public async restart({ userId, wechatUserId }: { userId: string; wechatUserId: string }) {
    const { app } = this
    const wechat = await this.getWechatByWechatUserId(userId, wechatUserId)

    if (!wechat) {
      throw ApiError.InvalidWeChatSessionId
    }
    // 判断是否对应userId
    if (userId !== wechat.user_id.toHexString()) {
      throw ApiError.PermissionDenied
    }

    await app.wechatClient.restart({ id: wechat.session_id.toHexString(), userId })
  }

  /**
   * handleMessage
   *
   * @param message
   */
  public handleMessage(message: Message): any {
    console.info('', message.toString())
  }

  /**
   * 根据userId获取Wechat
   *
   * @param userId 用户id
   */
  public getWechatByUserId(userId: string) {
    return this.ctx.model.Wechat.find({ user_id: userId })
  }

  /**
   * 根据微信用户id获取Wechat
   *
   * @param userId 用户id
   * @param wechatUserId 微信userId
   */
  public getWechatByWechatUserId(userId: string, wechatUserId: string) {
    return this.ctx.model.Wechat.findOne({ user_id: userId, wechatUserId })
  }

  /**
   * 根据 sessionId 获取 Wechat
   * @param sessionId
   */
  public getWechatBySessionId(sessionId: string) {
    return this.ctx.model.Wechat.findOne({ session_id: sessionId })
  }
  /**
   * 根据 sessionId 获取 Wechat
   * @param sessionId
   */
  public getWechatSessionById(id: string) {
    return this.ctx.model.WechatSession.findById(id)
  }
}
