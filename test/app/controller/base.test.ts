// import * as assert from 'assert'
import { app } from 'egg-mock/bootstrap'
import * as supertest from 'supertest'
import { ApiError } from '../../../app/constant/error'

describe('test/app/controller/base.test.ts', () => {
  it('404', async () => {
    const httpRequest: supertest.SuperTest<supertest.Test> = app.httpRequest()
    await httpRequest
      .post('/abcd')
      .type('json')
      .expect(200)
      .expect({
        error: { code: ApiError.NotFound.code, message: ApiError.NotFound.message }
      })
  })
})
