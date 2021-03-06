// tslint:disable:variable-name
export class ApiError extends Error {
  // 0 - 999 通用错误码
  static InternalServerError = new ApiError(1, 'Internal Server Error')
  static NotFound = new ApiError(2, 'Not Found')
  static InvalidSignature = new ApiError(3, 'Invalid Signature')
  static NotSignIn = new ApiError(4, 'Not Sign In')
  static PermissionDenied = new ApiError(5, 'Permission denied')
  static InvalidRequestParameter = new ApiError(400, '请求参数无效')
  // 1000 - 1999 用户模块
  static InvalidAccountOrPassword = new ApiError(1000, '帐号或密码错误')

  // 2000 - 2999 wechat
  static InvalidWeChatSessionId = new ApiError(2000, '无效的WeChatSessionId')

  code: number
  details: string[]
  constructor(code: number, message: string, details?: any) {
    super(message)
    this.code = code
    this.details = details
  }

  copy() {
    const error = new ApiError(this.code, this.message)

    return error
  }

  setDetails(msg: string) {
    const e = this.copy()
    e.details = e.details || []
    e.details.push(msg)
    return this
  }
  // assert(value) {
  //   if (value) return

  //   throw this
  // }
}

export default ApiError

// export const assert = <V>(value: V, error: ApiError, errorMsg?): NonNullable<V> => {
//   if (value) {
//     return value as NonNullable<V>
//   }

//   throw new ApiError(error.code, errorMsg)
// }
