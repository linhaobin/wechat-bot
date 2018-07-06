import { Application } from 'egg'
import { Document, Model } from 'mongoose'
// import { UserDocument } from './user'

export enum WechatStatus {
  Login = 1,
  Logout = 2
}

export interface Wechat {
  // user_id: Types.ObjectId
  user_id: string
  wechatUserId: string // 微信用户id
  name: string // 名称
  status: WechatStatus
  // session_id: Types.ObjectId // wechaty profile
  session_id: string // wechaty profile
}

export interface WechatDocument extends Wechat, Document {}
export type WechatModel = Model<WechatDocument>

export default (app: Application): WechatModel => {
  const { mongoose } = app
  const { Schema } = mongoose

  const schema = new Schema(
    {
      user_id: { type: Schema.Types.ObjectId, ref: 'User' },
      wechatUserId: { type: String },
      name: { type: String },
      status: { type: String },
      session_id: { type: Schema.Types.ObjectId, ref: 'WechatSession' }
    },
    { toJSON: { virtuals: true } }
  )

  schema.index({ user_id: 1, wechatUserId: 1 }, { unique: true })
  schema.index({ session_id: 1 }, { unique: true })

  // projects
  // schema.virtual('user', {
  //   ref: 'User',
  //   localField: 'user_id',
  //   foreignField: '_id'
  // })

  return mongoose.model('Wechat', schema)
}
