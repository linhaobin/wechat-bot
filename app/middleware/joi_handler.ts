export default () => {
  return async function errorHandler(ctx, next) {
    try {
      await next()
    } catch (err) {
      if (err && err.isJoi) {
        err.code = 1
      }
      throw err
    }
  }
}
