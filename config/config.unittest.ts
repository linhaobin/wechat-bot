import { DefaultConfig } from './config.default'

export default () => {
  const config: DefaultConfig = {
    admin: {
      username: `test${new Date().getTime()}`
    }
  }
  return config
}
