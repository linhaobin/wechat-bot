import { Controller } from 'egg'
import * as Joi from 'joi'

export default class SignController extends Controller {
  public async signIn() {
    const { ctx } = this

    const { body } = ctx.request

    // begin 验证参数
    const schema = Joi.object().keys({
      username: Joi.string()
        .alphanum()
        .min(4)
        .max(30)
        .required(),
      password: Joi.string().required()
    })

    const result = await Joi.validate(body, schema)

    ctx.body = result
  }
}
