import ApiError from '../errors/api_error'

export default () => {
  return async function errorHandler(_, next) {
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
