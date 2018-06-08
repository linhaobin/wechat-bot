import * as assert from 'assert'
import { Context } from 'egg'
import { app } from 'egg-mock/bootstrap'

describe('test/app/redis.test.js', () => {
  let ctx: Context

  before(async () => {
    ctx = app.mockContext()
  })

  it('set and get', async () => {
    // set
    await app.redis.set('foo', 'bar')
    // get
    const result = await app.redis.get('foo')
    assert(result === 'bar')
  })
})
