import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.post('/sign/sign-in', controller.sign.signIn)
  router.get('/sign/get-user', controller.sign.getUser)

  router.get('/wechat/login', controller.wechat.login)
}
