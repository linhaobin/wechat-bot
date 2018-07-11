import { EggAppConfig, PowerPartial } from 'egg'
import * as path from 'path'
import ApiError from '../app/errors/api_error'

// app special config scheme
export interface BizConfig {
  session: {
    expire: number
  }
  admin: {
    username: string
    initPassword: string
  }
  wechaty: {
    profilePath: string
  }
}

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>

export default (appInfo: EggAppConfig) => {
  // const config = {} as PowerPartial<EggAppConfig> & BizConfig
  const config: DefaultConfig = {}

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1526911046062_143'

  // cors
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  }
  // add your config here
  config.middleware = ['errorHandler', 'joiHandler', 'notfoundHandler', 'nobodyHandler', 'signatureHandler']

  // onerror
  config.onerror = {
    all(_, ctx) {
      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      ctx.status = 200
      ctx.body = { error: { code: ApiError.InternalServerError.code, message: ApiError.InternalServerError.message } }
    }
  }

  // mongose
  config.mongoose = {
    client: {
      url: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/wechat-bot',
      options: {}
    }
  }

  // redis
  config.redis = {
    client: {
      port: process.env.REDIS_PORT || 6379, // Redis port
      host: process.env.REDIS_HOST || '127.0.0.1', // Redis host
      password: process.env.REDIS_PASSWORD || null,
      db: process.env.REDIS_DB || 0
    }
  }

  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: []
      }
    },
    redis: {
      port: process.env.IO_REDIS_PORT || config.redis.client.port,
      host: process.env.IO_REDIS_HOST || config.redis.client.host,
      auth_pass: process.env.IO_REDIS_PASSWORD || config.redis.client.password,
      db: process.env.IO_REDIS_DB || config.redis.client.db
    }
  }

  // session
  config.session = {
    expire: 24 * 3600 * 1000 // ms，24小时
  }

  // admin
  config.admin = {
    username: 'admin', // 用户名
    initPassword: 'admin' // 初始密码
  }

  // wechaty
  config.wechaty = {
    profilePath: path.resolve(__dirname, '../wechaty')
  }

  return config as PowerPartial<EggAppConfig> & BizConfig
}
