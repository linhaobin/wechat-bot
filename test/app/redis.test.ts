import * as assert from 'assert'
import { Application, Context } from 'egg'
import mock, { BaseMockApplication } from 'egg-mock'

describe('test/app/redis.test.js', () => {
  let app: BaseMockApplication<Application, Context>

  before(async () => {
    app = mock.app()
  })

  it('set and get', async () => {
    // set
    await app.redis.set('foo', 'bar')
    // get
    const result = await app.redis.get('foo')
    assert(result === 'bar')
  })
})
