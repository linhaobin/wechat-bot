import { Context as EggContext } from 'egg'
import { Mongoose } from 'mongoose'
import { BaseMockApplication } from 'egg-mock'
import { Redis } from 'ioredis'
import * as cluster from 'cluster-client'
import { Socket } from 'socket.io'
import WechatClient from '../app/client/wechat_client'
import { ApiError } from '../app/errors/api_error'

declare module 'egg' {
  // 扩展 app
  interface Application {
    mongoose: Mongoose
    redis: Redis
    cluster: cluster
    wechatClient: WechatClient
  }

  interface Agent extends Application {}

  // 扩展 Context
  interface Session {
    id: string
    userId: string
    accessToken: string
    expire: number
    expireAt: number
  }
  interface Context {
    session: Session
  }

  interface IoContext extends EggContext {
    socket: Socket // egg-socket.io
  }

  // 扩展 IHelper
  interface IHelper {}
}
