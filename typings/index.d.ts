import { Mongoose } from 'mongoose'
import { BaseMockApplication } from 'egg-mock'
import { Redis } from 'ioredis'
import { ApiError } from '../app/errors/api_error'
import * as contextExtend from '../app/extend/context'
import * as helperExtend from '../app/extend/helper'

declare module 'egg' {
  // 扩展 app
  interface Application {
    mongoose: Mongoose
    redis: Redis
  }

  // 扩展 Context
  interface Session {
    id: string
    userId: string
    accessToken: string
    expire: number
    expireAt: number
  }
  interface Context extends ContextExtend {
    session: Session
  }

  // 扩展 IHelper
  interface IHelper extends Helper {}
}
