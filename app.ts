import { Application } from 'egg'

export default (app: Application) => {
  app.beforeStart(async () => {
    // TODO: 创建默认用户
  })
}
