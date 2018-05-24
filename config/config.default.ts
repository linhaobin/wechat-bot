import { EggAppConfig, PowerPartial } from 'egg'

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>

// app special config scheme
export interface BizConfig {
  sourceUrl: string
}

export default (appInfo: EggAppConfig) => {
  const config = {} as PowerPartial<EggAppConfig> & BizConfig

  // app special config
  config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1526911046062_143'

  // add your config here
  config.middleware = ['errorHandler', 'joiHandler']

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

  return config
}
