export default () => {
  return async function errorHandler(ctx, next) {
    try {
      await next()
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx)

      // 错误码，默认：-1，未知
      const code = err.errorCode || err.code || -1
      // 错误信息
      const message = err.message || 'Internal Server Error'

      // 不是生产环境才显示
      const details = (ctx.app.config.env === 'prod' && err.details) || undefined

      ctx.body = { error: { code, message, details } }
    }
  }
}
