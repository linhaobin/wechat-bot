// import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuid } from 'uuid'
import { Contact, Message, Wechaty } from 'wechaty'

export interface Options {
  profilePath: string
  userId: string
  id?: string
}

// let globalWechaty: Wechaty

export default class WechatyClient {
  id: string
  profilePath: string
  userId: string
  options: Options
  wechaty: Wechaty

  constructor(options: Options) {
    this.profilePath = options.profilePath
    this.id = options.id || uuid()
    this.userId = options.userId
    this.options = options

    this.init()
  }

  /**
   * 登录
   */
  public login() {
    return new Promise<{ qrcode: string; status: number }>(async (resolve, reject) => {
      try {
        // 扫描事件
        this.wechaty.once('scan', async (qrcode: string, status: number) => {
          console.info(`scan: ${qrcode} `)
          resolve({ qrcode, status })
        })

        // fix: WARN PuppetPuppeteer initWatchdogForPuppet() dog.on(reset) last food:inited, timeout:120000
        this.wechaty.on('login', () => {
          const watchdog = () => {
            this.wechaty.puppet.emit('watchdog', { data: 'any', timeout: 2 * 60 * 1000 })

            setTimeout(watchdog, 60 * 1000)
          }
          watchdog()
        })

        this.initListener()

        await this.wechaty.start().catch(reject)
      } catch (err) {
        reject(err)
      }
    })
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

  //   this.init(wechaty)

  //   wechaty.start()
  // }

  /**
   * 初始化
   */
  private init() {
    this.wechaty = new Wechaty({ profile: this.getProfile(this.id) })

    // TODO: 0.14 not support multiple
    // if (!globalWechaty) {
    //   globalWechaty = this.wechaty = Wechaty.instance({ profile: this.getProfile(this.id) })
    //   this.wechaty.stop()
    //   this.wechaty.reset()
    // }
    // this.wechaty = globalWechaty
  }

  /**
   * 初始化监听器
   */
  private async initListener() {
    this.wechaty.on('login', async wechatUser => {
      this.handleLogin(wechatUser)
    })

    this.wechaty.on('logout', async wechatUser => {
      this.handleLogout(wechatUser)
    })

    this.wechaty.on('message', async message => {
      this.handleMessage(message)
    })

    // TODO 1分钟后检查是否已登录，未登录则删除该wechaty
  }

  /**
   * handleLogin
   *
   */
  private handleLogin(wechatUser: Contact): any {
    console.info('login', wechatUser.id)
  }
  /**
   * handleLogin
   *
   */
  private handleLogout(wechatUser: Contact): any {
    console.info('logout', wechatUser.id)
  }
  /**
   * handleMessage
   *
   * @param message
   */
  private handleMessage(message: Message): any {
    console.info('message', message.toString())
  }

  // 获取 profile 路径
  private getProfile(name: string) {
    const profilePath = this.options.profilePath

    return path.resolve(profilePath, name)
  }
}
