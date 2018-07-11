import WechatyClient, { Options as WechatyClientOptions } from './wechaty'

export interface Options {
  profilePath: string
  on: WechatyClientOptions['on']
}

export default class WechatManager {
  clientMap: Map<string, WechatyClient> = new Map()
  options: Options
  constructor(options: Options) {
    this.options = options
  }

  /**
   * login
   */
  public async login({ id, userId }: { id: string; userId: string }) {
    const client = new WechatyClient({ id, userId, profilePath: this.options.profilePath, on: this.options.on })
    this.set(client.id, client)

    return client.login()
  }

  /**
   * start
   */
  public async start({ id, userId }: { id: string; userId: string }) {
    const client = new WechatyClient({ id, userId, profilePath: this.options.profilePath, on: this.options.on })
    this.set(client.id, client)

    return client.start()
  }

  /**
   * stop
   */
  public async stop({ id }: { id: string; userId: string }) {
    const client = this.get(id)

    if (!client) return

    this.remove(id)
    return client.stop()
  }

  public get(id: string) {
    return this.clientMap.get(id)
  }

  public set(id: string, wechatClient: WechatyClient) {
    this.clientMap.set(id, wechatClient)
  }

  public remove(id: string) {
    this.clientMap.delete(id)
  }
}
