import { Agent, Application } from 'egg'
import WechatClusterClient from '../client/wechat_data_client'

// import { WechatyMessageKey } from '../constant/messenger'
// import WechatyManager from '../lib/wechaty/wechaty_manager'

export default (agent: Agent) => {
  // const config = agent.config as Application['config']
  // const wechatyManager = new WechatyManager({ profilePath: config.wechaty.profilePath })
  // // agent.wechatyManager = wechatyManager
  // agent.on(WechatyMessageKey.Login, (data: { userId: string }) => {
  //   wechatyManager.login(data.userId)
  // })

  // 对 WechatClient 进行封装和实例化
  agent.wechatClient = agent.cluster(WechatClusterClient).create({
    logger: agent.logger
  })
}
