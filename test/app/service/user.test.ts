import * as assert from 'assert'
import * as bcrypt from 'bcryptjs'
import { Application, Context } from 'egg'
import mock, { BaseMockApplication } from 'egg-mock'
import { v4 as uuid } from 'uuid'

describe('test/app/service/user.test.js', () => {
  let app: BaseMockApplication<Application, Context>
  let ctx: Context

  before(async () => {
    app = mock.app()
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
