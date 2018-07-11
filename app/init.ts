import { Application } from 'egg'
import WechatClient from './client/wechat_client'
import { Event } from './client/wechaty'
import { WECHAT_EVENT } from './constant/messengerKey'

export default (app: Application) => {
  // 对 WechatClient 进行封装和实例化
  app.wechatClient = new WechatClient({
    app
  })

  app.beforeStart(async () => {
    await app.wechatClient.ready()
    app.logger.info('app: wechat client is ready')
  })

  // wechat event
  const messenger: any = app.messenger
  messenger.on(WECHAT_EVENT, (event: Event) => {
    const ctx = app.createAnonymousContext()
    ctx.logger.info(`on wechat event: ${JSON.stringify(event)}`)
    switch (event.type) {
      case 'login':
        ctx.service.wechat.login({
          wechatSessionId: event.id,
          userId: event.userId,
          wechatUserId: event.data.id,
          name: event.data.name
        })
        break
      case 'logout':
        ctx.service.wechat.logout({
          wechatSessionId: event.id,
          userId: event.userId
        })
        break
    }
  })
}
