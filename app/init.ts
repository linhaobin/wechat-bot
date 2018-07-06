import { Application } from 'egg'
import WechatClient from './client/wechat_client'

export default (app: Application) => {
  // 对 WechatClient 进行封装和实例化
  app.wechatClient = new WechatClient({
    logger: app.logger,
    profilePath: app.config.wechaty.profilePath
  })

  app.beforeStart(async () => {
    await app.wechatClient.ready()
    app.logger.info('app: wechat client is ready')
  })
}
