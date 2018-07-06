import * as cluster from 'cluster-client'
import * as Base from 'sdk-base'
import WechatDataClient, { Options as WechatDataClientOptions } from './wechat_data_client'

// const _cluster: cluster = cluster.ClientWrapper

export interface Options extends WechatDataClientOptions {
  cluster?: typeof cluster
  clusterOptions?: any
}
export default class WechatClient extends Base {
  client: WechatDataClient
  constructor(options: Options) {
    super({ initMethod: 'init' })
    const wrapper = (options.cluster || cluster)(WechatDataClient, options.clusterOptions)

    wrapper.delegate('login', 'invoke')
    this.client = wrapper.create({
      logger: options.logger,
      profilePath: options.profilePath
    })
  }

  /**
   * 启动逻辑
   */
  async init() {
    this.ready(true)
  }

  login(id: string, userId: string) {
    return this.client.login(id, userId)
  }

  loginForPublish({ id, userId }: { id: string; userId: string }) {
    return new Promise(resolve => {
      this.client.publish({ type: 'login', payload: { id, userId } })
      this.client.subscribe({ type: 'login', payload: { id } }, data => {
        resolve(data)
      })
    })
  }
}
