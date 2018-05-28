import { Service } from 'egg'
import { User } from '../model/user'

export default class Test extends Service {
  /**
   * 初始化管理员
   */
  public async initAdmin() {
    const { config, ctx } = this
    let user = await this.getUserByUsername(config.admin.username)

    if (user) return

    // 如果用户不存在，创建一个admin用户
    user = new ctx.model.User()

    user.username = config.admin.username
    // TODO: md5
    user.password = config.admin.initPassword

    user.save()
  }
  /**
   * 保存
   * @param newUser
   */
  public async save(newUser: User) {
    const user = new this.ctx.model.User()

    Object.assign(user, newUser)

    return user.save()
  }

  /**
   * 根据 username 获取
   * @param username
   */
  public async getUserByUsername(username: string) {
    const query = { username }
    return this.ctx.model.User.findOne(query)
  }
}
