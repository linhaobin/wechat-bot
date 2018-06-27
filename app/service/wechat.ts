import { Service } from 'egg'
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuid } from 'uuid'
import { Contact, Wechaty } from 'wechaty'
import { WechatStatus } from '../model/wechat'
import { WechatSessionStatus } from '../model/wechat_session'

interface WechatyCache {
  wechaty: Wechaty
}
interface WechatyCachePool {
  [id: string]: WechatyCache
}
const wechatyPool: WechatyCachePool = {}

interface NotLoginWechaty extends Wechaty {
  userId: string
  sessionId: string
}
interface LoginWechaty extends NotLoginWechaty {
  wechatUserId: string
}

export default class WechatService extends Service {
  /**
   * 登录
   */
  public login(userId: string) {
    return new Promise<{ qrcode: string; status: number }>(async (resolve, reject) => {
      try {
        const sessionId = uuid()
        const wechaty = this.newWechaty({ sessionId, userId })
        // 扫描事件
        wechaty.once('scan', async (qrcode: string, status: number) => {
          resolve({ qrcode, status })
        })

        this.init(wechaty)

        wechaty.start().catch(reject)
      } catch (err) {
        reject(err)
      }
    })
  }

  // 重新启动
  public async restart(sessionId: string) {
    const profile = this.getProfile(sessionId)

    if (!fs.existsSync(profile)) {
      return
    }

    const wechat = await this.getWechatBySessionId(sessionId)

    if (!wechat) {
      return
    }

    const wechaty = this.newWechaty({ userId: wechat.user_id, sessionId, wechatUserId: wechat.wechatUserId })

    // 扫描事件
    wechaty.once('scan', async () => {
      this.logout(wechaty)
    })

    this.init(wechaty)

    wechaty.start()
  }

  public async init(wechaty: NotLoginWechaty) {
    const { ctx } = this

    wechaty.on('login', async (wechatUser: Contact) => {
      this.putWechatyCache(wechaty.sessionId, wechaty)

      let wechat = await this.getWechat(wechaty.userId, wechatUser.id)

      // save wechat session
      const wechatSession = new ctx.model.WechatSession()
      wechatSession._id = wechaty.sessionId
      wechatSession.user_id = wechaty.userId
      wechatSession.wechat_id = wechatUser.id
      wechatSession.wechatUserId = wechatUser.id
      wechatSession.status = WechatSessionStatus.Login
      wechatSession.loginTime = Date.now()

      // 创建新的Wechat
      if (!wechat) {
        wechat = new ctx.model.Wechat()
        wechat._id = wechatUser.id
        wechat.user_id = wechaty.userId
        wechat.wechatUserId = wechatUser.id
      }
      wechat.session_id = wechaty.sessionId
      wechat.name = wechatUser.name()
      wechat.status = WechatStatus.Login

      await Promise.all([wechat.save(), wechatSession.save()])
    })

    wechaty.on('logout', async () => {
      this.logout(wechaty)
    })

    // TODO 1分钟后检查是否已登录，未登录则删除该wechaty
  }

  // 处理登出
  private async logout<T extends NotLoginWechaty>(wechaty: T) {
    this.removeWechatyCache(wechaty.sessionId)

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
   * 获取Wechat
   * @param userId 用户id
   * @param wechatUserId 微信userId
   */
  private getWechat(userId: string, wechatUserId: string) {
    return this.ctx.model.Wechat.findOne({ user_id: userId, wechatUserId })
  }

  /**
   * 根据 sessionId 获取 Wechat
   * @param sessionId
   */
  private getWechatBySessionId(sessionId: string) {
    return this.ctx.model.Wechat.findOne({ session_id: sessionId })
  }

  // 通过 name 获取Wechaty
  // private getWechatyByCache(profile: string) {
  //   return wechatyPool[profile]
  // }
  // 通过 name 获取Wechaty
  private putWechatyCache(id: string, wechaty: Wechaty) {
    wechatyPool[id] = wechaty
  }

  // 移除wechaty
  private removeWechatyCache(id: string) {
    delete wechatyPool[id]
  }

  // 获取 profile 路径
  private getProfile(name: string) {
    const { config } = this

    return path.resolve(config.wechaty.profilePath, name)
  }

  private newWechaty(options: { userId: string; sessionId: string }): NotLoginWechaty
  private newWechaty(options: { userId: string; sessionId: string; wechatUserId: string }): LoginWechaty
  private newWechaty(options: { userId: string; sessionId: string; wechatUserId?: string }) {
    const { sessionId, userId, wechatUserId } = options
    const wechaty = new Wechaty({ profile: this.getProfile(sessionId) })
    // tslint:disable-next-line
    ;(wechaty as NotLoginWechaty).sessionId = sessionId
    // tslint:disable-next-line
    ;(wechaty as NotLoginWechaty).userId = userId

    if (wechatUserId) {
      // tslint:disable-next-line
      ;(wechaty as LoginWechaty).wechatUserId = wechatUserId
      // tslint:disable-next-line
    }

    return wechaty
  }

  // private isLogin(wechaty: Wechaty): wechaty is LoginWechaty {
  //   return !!(wechaty as LoginWechaty).wechatUserId
  // }
}
