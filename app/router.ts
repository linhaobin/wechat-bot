import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.post('/sign-in', controller.sign.signIn)
}
