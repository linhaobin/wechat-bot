import { Application } from 'egg'
import { Document, Model, Types } from 'mongoose'
import { UserDocument } from './user'

export interface Instance {
  name: string // 名称
  description?: string // 描述
  project_ids: Types.ObjectId[] // 关联的Project
  projects: UserDocument[]
}

export interface InstanceDocument extends Instance, Document {}
export type InstanceModel = Model<InstanceDocument>

export default (app: Application): InstanceModel => {
  const { mongoose } = app
  const { Schema } = mongoose

  const schema = new Schema({
    name: { type: String },
    description: { type: String },
    project_ids: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
  })

  schema.index({ name: 1 }, { unique: true })

  // projects
  schema.virtual('projects', {
    ref: 'Project',
    localField: 'project_ids',
    foreignField: '_id',
    justOne: false
  })

  return mongoose.model('Instance', schema)
}
