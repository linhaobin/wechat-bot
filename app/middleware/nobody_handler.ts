export default () => {
  return async function nobodyHandler(ctx, next) {
    await next()
    if (ctx.status === 200 && !ctx.body) {
      ctx.body = {}
    }
  }
}
