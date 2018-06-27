import { Model } from 'mongoose'
import { UserModel } from '../../../app/model/user'
import { ProjectModel } from '../../../app/model/project'
import { WechatModel } from '../../../app/model/wechat'
import { WechatSessionModel } from '../../../app/model/wechat_session'

declare module 'egg' {
  interface Context {
    model: {
      User: UserModel
      Project: ProjectModel
      Wechat: WechatModel
      WechatSession: WechatSessionModel
    }
  }
}
