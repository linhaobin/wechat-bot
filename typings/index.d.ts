import { Mongoose } from 'mongoose'
import {BaseMockApplication} from 'egg-mock'

declare module 'egg' {
  // 扩展 app
  interface Application {
    mongoose: Mongoose
  }

  interface Content {}
}
