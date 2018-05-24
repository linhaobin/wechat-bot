import { Service } from 'egg'
import { User } from '../model/user'

export default class Test extends Service {
  /**
   * 保存
   * @param newUser
   */
  public async save(newUser: User) {
    const user = new this.ctx.model.User()

    Object.assign(user, newUser)

    return await user.save()
  }

  /**
   * 根据 username 获取
   * @param username
   */
  public async getUserByUsername(username: string) {
    const query = { username }
    return await this.ctx.model.User.findOne(query)
  }
}
