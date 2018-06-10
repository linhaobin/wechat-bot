import { Model } from 'mongoose'
import { UserModel } from '../../../app/model/user'
import { ProjectModel } from '../../../app/model/project'
import { InstanceModel } from '../../../app/model/instance'

declare module 'egg' {
  interface Context {
    model: {
      User: UserModel
      Project: ProjectModel
      Instance: InstanceModel
    }
  }
}
