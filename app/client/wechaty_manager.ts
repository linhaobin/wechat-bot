import WechatClient from './wechaty'

export interface Options {
  profilePath: string
}

export default class WechatManager {
  clientMap: Map<string, WechatClient> = new Map()
  options: Options
  constructor(options: Options) {
    this.options = options
  }

  /**
   * 登录
   */
  public async login(id: string, userId: string) {
    const client = new WechatClient({ id, userId, profilePath: this.options.profilePath })
    this.clientMap.set(client.id, client)

    return client.login()
  }

  public get(id: string) {
    return this.clientMap.get(id)
  }
}
