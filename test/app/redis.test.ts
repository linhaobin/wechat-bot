import * as assert from 'assert'
import { app } from './bootstrap'

describe('test/app/redis.test.js', () => {
  it('set and get', async () => {
    // set
    await app.redis.set('foo', 'bar')
    // get
    const result = await app.redis.get('foo')
    assert(result === 'bar')
  })
})
