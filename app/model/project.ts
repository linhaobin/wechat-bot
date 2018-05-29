import { Application } from 'egg'
import { Document, Model, Types } from 'mongoose'
import { InstanceDocument } from './instance'

export interface Project {
  name: string // 名称
  description?: string // 描述
  disabled: boolean // 是否禁用
  instance_ids: Types.ObjectId[] // 关联的实例
  instances: InstanceDocument[] // 关联的实例
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
      instance_ids: [{ type: Schema.Types.ObjectId, ref: 'Instance' }],
      web_hooks: { type: [String] },
      token: String
    },
    { toJSON: { virtuals: true } }
  )

  schema.index({ name: 1 }, { unique: true })

  // instances
  schema.virtual('instances', {
    ref: 'Instance',
    localField: 'instance_ids',
    foreignField: '_id',
    justOne: false
  })

  return mongoose.model('Project', schema)
}
