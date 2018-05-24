import * as assert from 'assert'
import { app } from 'egg-mock/bootstrap'
import * as supertest from 'supertest'

describe('sign/app/controller/sign.test.ts', () => {
  it('sign-in', async () => {
    const httpRequest: supertest.SuperTest<supertest.Test> = app.httpRequest()
    await httpRequest
      .post('/sign-in')
      .type('json')
      .send({
        username: 'admin',
        password: '20180522'
      })
      .expect(200)
  })

  it('sign-in 不传参数', async () => {
    const httpRequest: supertest.SuperTest<supertest.Test> = app.httpRequest()
    const response = await httpRequest
      .post('/sign-in')
      .type('json')
      .send()
      .expect(200)

    const result = response.body
    assert(result.error && result.error.code === 1)
  })
})
