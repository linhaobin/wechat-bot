import { Controller } from 'egg'
import * as Joi from 'joi'

// Start signIn 登入参数
interface SignInRequest {
  username: string
  password: string
}
const signInSchema = Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .min(4)
    .max(30)
    .required(),
  password: Joi.string().required()
})
// End 登入参数

export default class SignController extends Controller {
  /**
   * 登入
   */
  public async signIn() {
    const { ctx } = this

    const body: SignInRequest = ctx.request.body

    // 验证参数
    const params = await Joi.validate(body, signInSchema)

    const session = await ctx.service.sign.signIn(params)

    ctx.success(session)
  }

  /**
   * 获取当前登入用户
   *
   * @memberof SignService
   */
  public async getUser() {
    const { ctx } = this

    const user = await ctx.getUser()

    ctx.success(user)
  }
}
