import * as assert from 'assert'
import { Context } from 'egg'
import { app } from 'egg-mock/bootstrap'
import * as uuid from 'uuid/v4'

describe('test/app/service/user.test.js', () => {
  let ctx: Context

  before(async () => {
    ctx = app.mockContext()
  })

  it('create and get', async () => {
    const newUser = { username: uuid(), password: uuid() }
    await ctx.service.user.save(newUser)

    const result = await ctx.service.user.getUserByUsername(newUser.username)
    assert(result && result._id)
  })

})
