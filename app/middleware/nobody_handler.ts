export default () => {
  return async function nobodyHandler(ctx, next) {
    await next()
    if (ctx.status === 200 && (ctx.body === undefined || ctx.body === null)) {
      ctx.status = 204
    }
  }
}
