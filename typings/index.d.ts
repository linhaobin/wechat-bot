import { Mongoose } from 'mongoose'
import { BaseMockApplication } from 'egg-mock'
import { ApiError, assert } from '../app/errors/api_error'
import { success } from '../app/extend/context'

declare module 'egg' {
  // 扩展 app
  interface Application {
    mongoose: Mongoose
  }

  interface Context {
    success: typeof success
  }

  interface IHelper {
    assert: typeof assert
    ApiError: typeof ApiError
  }
}
