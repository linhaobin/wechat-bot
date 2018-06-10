import * as bcrypt from 'bcryptjs'
import { Service, Session } from 'egg'
import { v4 as uuid } from 'uuid'
import * as cacheKey from '../constant/cacheKey'
import ApiError from '../errors/api_error'

export default class SignService extends Service {
  /**
   * 登录
   * @param { username: string; password: string }
   */
  public async signIn({ username, password }: { username: string; password: string }) {
    const { ctx } = this

    // 根据用户名查询
    const user = await ctx.service.user.getUserByUsername(username)

    // 检查用户是否存在
    if (!user) throw ApiError.InvalidAccountOrPassword

    // 检查密码
    if (!bcrypt.compareSync(password, user.password)) throw ApiError.InvalidAccountOrPassword

    // session
    const session = await this.newSession(user.id)

    return session
  }

  /**
   * 根据SessionId获取Session
   */
  public async getSessionBySessionId(sessionId: string) {
    const sessionJson = await this.app.redis.get(cacheKey.session(sessionId))

    if (!sessionJson) return

    const session: Session = JSON.parse(sessionJson)

    return session
  }

  /**
   * 生成新的Session
   *
   * @private
   * @param {string} userId
   * @returns
   * @memberof SignService
   */
  private async newSession(userId: string) {
    const { app } = this
    const session: Session = {
      id: uuid(),
      userId,
      accessToken: uuid(),
      expire: app.config.session.expire,
      expireAt: Date.now() + app.config.session.expire
    }

    await app.redis.setex(cacheKey.session(session.id), app.config.session.expire / 1000, JSON.stringify(session))
    await app.redis.lpush(cacheKey.userSessionsList(userId), session.id)

    return session
  }
}
