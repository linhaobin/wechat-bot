import { Application } from 'egg'
import { Document, Model, Types } from 'mongoose'
import { WechatDocument } from './wechat'

export interface Project {
  name: string // 名称
  description?: string // 描述
  disabled: boolean // 是否禁用
  wechat_ids: Types.ObjectId[] // 关联的实例
  wechats: WechatDocument[] // 关联的实例
  web_hooks: string[] // webhook
  token?: string
}

export interface ProjectDocument extends Project, Document {}
export type ProjectModel = Model<ProjectDocument>

export default (app: Application): ProjectModel => {
  const { mongoose } = app
  const { Schema } = mongoose

  const schema = new Schema(
    {
      name: { type: String },
      description: { type: String },
      disabled: { type: Boolean },
      wechat_ids: [{ type: Schema.Types.ObjectId, ref: 'Wechat' }],
      web_hooks: { type: [String] },
      token: String
    },
    { toJSON: { virtuals: true } }
  )

  schema.index({ name: 1 }, { unique: true })

  // instances
  schema.virtual('wechats', {
    ref: 'Wechat',
    localField: 'wechat_ids',
    foreignField: '_id',
    justOne: false
  })

  return mongoose.model('Project', schema)
}
