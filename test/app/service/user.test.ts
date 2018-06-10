import * as assert from 'assert'
import * as bcrypt from 'bcryptjs'
import { Context } from 'egg'
import { v4 as uuid } from 'uuid'
import { app } from '../bootstrap'

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

  it('init admin', async () => {
    await ctx.service.user.initAdmin()

    const result = await ctx.service.user.getUserByUsername(app.config.admin.username)
    if (!result) return assert(false)
    assert(bcrypt.compareSync(app.config.admin.initPassword, result.password))
  })
})
