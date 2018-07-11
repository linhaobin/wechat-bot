import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.get('/test', controller.test.test)

  router.post('/sign/sign-in', controller.sign.signIn)
  router.get('/sign/get-user', controller.sign.getUser)

  router.get('/wechat', controller.wechat.getWechat)
  router.get('/wechat/scan', controller.wechat.scan)
  router.post('/wechat/restart', controller.wechat.restart)
}
