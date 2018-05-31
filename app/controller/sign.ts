import { Controller } from 'egg'
import * as Joi from 'joi'
import ApiError from '../errors/api_error'

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

    // 根据用户名查询
    const user = await ctx.service.user.getUserByUsername(params.username)

    // 用户不存在
    if (!user) throw ApiError.InvalidAccountOrPassword

    // 密码错误
    // TODO: 密码md5
    ApiError.InvalidAccountOrPassword.assert(user.password === params.password)

    // TODO: 返回 touken，用于调用接口
    ctx.success()
  }
}
