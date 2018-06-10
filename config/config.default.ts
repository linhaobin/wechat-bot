import { EggAppConfig, PowerPartial } from 'egg'
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
      url: 'mongodb://127.0.0.1:27017/wechat-bot',
      options: {}
    }
  }

  // redis
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: null,
      db: 0
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

  return config as PowerPartial<EggAppConfig> & BizConfig
}
