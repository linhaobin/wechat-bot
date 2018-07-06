import { Application } from 'egg'
import { Document, Model } from 'mongoose'
// import { UserDocument } from './user'

export enum WechatSessionStatus {
  Login = 1,
  Logout = 2
}

export interface WechatSession {
  // user_id: Types.ObjectId
  // wechat_id: Types.ObjectId
  user_id: string
  wechat_id: string
  wechatUserId: string // 微信用户id
  status: WechatSessionStatus
  loginTime: number
  logoutTime: number
}

export interface WechatSessionDocument extends WechatSession, Document {}
export type WechatSessionModel = Model<WechatSessionDocument>

export default (app: Application): WechatSessionModel => {
  const { mongoose } = app
  const { Schema } = mongoose

  const schema = new Schema(
    {
      user_id: { type: Schema.Types.ObjectId, ref: 'User' },
      wechat_id: { type: Schema.Types.ObjectId, ref: 'Wechat' },
      wechatUserId: { type: String },
      status: { type: String },
      loginTime: { type: Number },
      logoutTime: { type: Number }
    },
    { toJSON: { virtuals: true } }
  )

  schema.index({ user_id: 1, wechatUserId: 1 }, { unique: true })

  // projects
  // schema.virtual('user', {
  //   ref: 'User',
  //   localField: 'user_id',
  //   foreignField: '_id'
  // })

  return mongoose.model('WechatSession', schema)
}
