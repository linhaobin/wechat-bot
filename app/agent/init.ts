import { Agent, Application } from 'egg'
import WechatClient from '../client/wechat_client'

export default (agent: Agent) => {
  const config = agent.config as Application['config']
  // 对 WechatClient 进行封装和实例化
  agent.wechatClient = new WechatClient({
    logger: agent.logger,
    profilePath: config.wechaty.profilePath
  })

  agent.beforeStart(async () => {
    await agent.wechatClient.ready()
    agent.logger.info('agent: wechat client is ready')
  })
}
