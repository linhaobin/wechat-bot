// import * as assert from 'assert'
import ApiError from '../../../app/errors/api_error'
import { app, httpRequest, httpRequestSignature } from '../bootstrap'

describe('test/app/controller/base.test.ts', () => {
  it('Not Found', async () => {
    await httpRequest()
      .post('/abcd')
      .use(httpRequestSignature)
      .type('json')
      .expect(200)
      .expect({
        error: { code: ApiError.NotFound.code, message: ApiError.NotFound.message }
      })
  })
  it('Invalid Signature', async () => {
    await httpRequest()
      .post('/test')
      .type('json')
      .expect(200)
      .expect({
        error: { code: ApiError.InvalidSignature.code, message: ApiError.InvalidSignature.message }
      })
  })
})
