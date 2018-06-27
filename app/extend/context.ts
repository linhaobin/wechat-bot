import { Context } from 'egg'
import ApiError from '../errors/api_error'

const extend = {
  success(this: Context, data?: any) {
    if (!data) {
      this.status = 204
      return
    }
    this.status = 200
    this.body = data
  },

  /**
   * 获取等钱登录用户
   * @return User
   */
  async getSession(this: Context) {
    const { session } = this
    if (!session) throw ApiError.NotSignIn

    return session
  },

  /**
   * 获取等钱登录用户
   * @return User
   */
  async getUser(this: Context) {
    const session = await this.getSession()

    const user = await this.model.User.findById(session.userId)
    if (!user) throw ApiError.NotSignIn

    return user
  }
}

export default extend
