import { Mongoose } from 'mongoose'
import { BaseMockApplication } from 'egg-mock'
import { assert } from '../app/errors/apiError'

declare module 'egg' {
  // 扩展 app
  interface Application {
    mongoose: Mongoose
  }

  interface IHelper {
    assert: typeof assert
  }
}
