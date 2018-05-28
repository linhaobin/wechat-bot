import { Application } from 'egg'

export default (app: Application) => {
  app.beforeStart(async () => {
    // TODO: 创建默认用户

    const ctx = app.createAnonymousContext()

    // 初始化管理员
    await ctx.service.user.initAdmin()
  })
}
