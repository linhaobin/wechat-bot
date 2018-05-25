import { ApiError } from '../constant/error'

export default () => {
  return async function notFoundHandler(ctx, next) {
    await next()
    if (ctx.status === 404 && !ctx.body) {
      ctx.body = { error: { code: ApiError.NotFound.code, message: ApiError.NotFound.message } }
    }
  }
}
