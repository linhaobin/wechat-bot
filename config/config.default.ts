import { EggAppConfig, PowerPartial } from 'egg'
import ApiError from '../app/errors/apiError'

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>

// app special config scheme
export interface BizConfig {
  sourceUrl: string
  admin: {
    username: string
    initPassword: string
  }
}

export default (appInfo: EggAppConfig) => {
  const config = {} as PowerPartial<EggAppConfig> & BizConfig

  // app special config
  config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1526911046062_143'

  // add your config here
  config.middleware = ['errorHandler', 'joiHandler', 'notfoundHandler']

  // onerror
  config.onerror = {
    all(_, ctx) {
      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      ctx.status = 200
      ctx.body = { error: { code: ApiError.InternalServerError.code, message: ApiError.InternalServerError.message } }
    }
  }

  // security
  config.security = {
    csrf: {
      ignore: () => true
    }
  }

  // mongose
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/wechat-bot',
      options: {}
    }
  }

  config.admin = {
    username: 'admin', // 用户名
    initPassword: 'admin' // 初始密码
  }

  return config
}
