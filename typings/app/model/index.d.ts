import { UserModel } from '../../../app/model/user'

declare module 'egg' {
  interface Context {
    model: {
      User: UserModel
    }
  }
}
