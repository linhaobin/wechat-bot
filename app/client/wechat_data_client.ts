import { Logger } from 'egg'
import * as Base from 'sdk-base'
import WechatyManager from './wechaty_manager'

// const PUBLISH_KEY = 'wechaty'

export interface Options {
  profilePath: string
  logger: Logger
}
type Listener = (...args: any[]) => void
/**
 * subscribe data
 */
export interface BaseSubscribeData<T extends string, P extends any> {
  type: T
  payload: P
}
type LoginSubscribeData = BaseSubscribeData<'login', { id: string }>
export type SubscribeData = LoginSubscribeData
/**
 * publish data
 */
export interface BasePublishData<T extends string, P extends any> {
  type: T
  payload: P
}
type LoginPublishData = BasePublishData<'login', { id: string; userId: string }>
export type PublishData = LoginPublishData

export default class WechatClusterClient extends Base {
  options: Options
  wechatyManager: WechatyManager
  logger: Logger

  constructor(options: Options) {
    super({
      // 指定异步启动的方法
      initMethod: 'init'
    })
    this.options = options
    this.logger = options.logger
  }

  /**
   * 启动逻辑
   */
  async init() {
    const { profilePath } = this.options
    this.wechatyManager = new WechatyManager({ profilePath })
    this.ready(true)
  }

  /**
   * 订阅
   * @param {Object} data
   *   - {String} dataId - the dataId
   * @param {Function}  listener - the listener
   */
  subscribe(data: SubscribeData, listener: Listener) {
    this.logger.info(`subscribe: ${data}`)

    switch (data.type) {
      case 'login':
        this.subscribeLogin(data.payload, listener)
        break
    }
  }

  /**
   * 发布
   * @param {PublishData} data
   */
  publish(data: PublishData) {
    this.logger.info(`publish: ${data}`)

    switch (data.type) {
      case 'login':
        this.publishLogin(data.payload)
        break
    }
  }

  public login(id: string, userId: string) {
    return this.wechatyManager.login(id, userId)
  }

  /**
   * 登录
   */
  private async publishLogin({ id, userId }: LoginPublishData['payload']) {
    this.logger.info(`login id: ${id}`)

    const result = await this.wechatyManager.login(id, userId)

    const key = this.loginKey(id)
    this.emit(key, result)
  }

  private async subscribeLogin({ id }: LoginSubscribeData['payload'], listener: Listener) {
    const key = this.loginKey(id)
    this.on(key, listener)
  }

  private loginKey(id: string) {
    return `wechaty/login/${id}`
  }
}
