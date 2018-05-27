import ApiError from '../errors/apiError'

export default () => {
  return async function errorHandler(ctx, next) {
    try {
      await next()
    } catch (err) {
      if (err && err.isJoi) {
        const error = ApiError.InvalidRequestParameter.copy()
        error.details = err.details
        throw error
      }
      throw err
    }
  }
}
