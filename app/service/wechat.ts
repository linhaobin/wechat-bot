import { Service } from 'egg'
// import { v4 as uuid } from 'uuid'
import { Contact, Message } from 'wechaty'

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
  public async login(wechaty: any, wechatUser: Contact) {
    const { app, ctx } = this

    let wechat = await this.getWechatByWechatUserId(wechaty.userId, wechatUser.id)

    // save wechat session
    const ObjectId = app.mongoose.Types.ObjectId
    const wechatSession = new ctx.model.WechatSession()

    const wechatId = new ObjectId().toHexString()
    // const userId = new ObjectId(wechaty.userId)
    // const wechatSessionId = new ObjectId(wechaty.sessionId)
    const userId = wechaty.userId
    const wechatSessionId = wechaty.sessionId

    wechatSession._id = wechatSessionId
    wechatSession.user_id = userId
    wechatSession.wechat_id = wechatId
    wechatSession.wechatUserId = wechatUser.id
    wechatSession.status = WechatSessionStatus.Login
    wechatSession.loginTime = Date.now()

    // 创建新的Wechat
    if (!wechat) {
      wechat = new ctx.model.Wechat()
      wechat._id = wechatId
      wechat.user_id = userId
      wechat.wechatUserId = wechatUser.id
    }
    wechat.session_id = wechatSessionId
    wechat.name = wechatUser.name()
    wechat.status = WechatStatus.Login

    await Promise.all([wechat.save(), wechatSession.save()])
  }

  /**
   * handleLogout 处理登出
   *
   * @param wechaty
   */
  public async logout(wechaty: any) {
    const wechatSession = await this.ctx.model.WechatSession.findById(wechaty.sessionId)

    if (!wechatSession) return

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
   * handleMessage
   *
   * @param message
   */
  public handleMessage(message: Message): any {
    console.info('', message.toString())
  }

  // 重新启动
  // public async restart(userId: string, sessionId: string) {
  //   const wechat = await this.getWechatBySessionId(sessionId)

  //   if (!wechat) {
  //     throw ApiError.InvalidWeChatSessionId
  //   }

  //   // 判断是否对应userId
  //   if (userId !== wechat.user_id) {
  //     throw ApiError.PermissionDenied
  //   }

  //   const profile = this.getProfile(sessionId)
  //   if (!fs.existsSync(profile)) {
  //     throw new Error('wechaty profile not exists')
  //   }

  //   const wechaty = this.newWechaty({
  //     userId: wechat.user_id,
  //     sessionId,
  //     wechatUserId: wechat.wechatUserId
  //   })

  //   // 扫描事件
  //   wechaty.once('scan', async () => {
  //     this.handleLogout(wechaty)
  //   })

  //   wechaty.start()
  // }

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
}
