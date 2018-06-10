// import * as assert from 'assert'
import ApiError from '../../../app/errors/api_error'
import { genSignature, NONCE_KEY, SIGNATURE_KEY, TIMESTAMP_KEY } from '../../../app/middleware/signature_handler'
import { httpRequest, httpRequestSignature } from '../bootstrap'

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

  it('Invalid timestamp', async () => {
    const timestamp = 'abc'
    const nonce = Date.now() + ''
    const signature = genSignature(timestamp, nonce)
    await httpRequest()
      .post('/test')
      .set({
        [TIMESTAMP_KEY]: timestamp,
        [NONCE_KEY]: nonce,
        [SIGNATURE_KEY]: signature
      })
      .type('json')
      .expect(200)
      .expect({
        error: { code: ApiError.InvalidSignature.code, message: ApiError.InvalidSignature.message }
      })
  })

  it('nonce is empty', async () => {
    const timestamp = 'abc'
    const signature = genSignature(timestamp)
    await httpRequest()
      .post('/test')
      .set({
        [TIMESTAMP_KEY]: timestamp,
        [SIGNATURE_KEY]: signature
      })
      .type('json')
      .expect(200)
      .expect({
        error: { code: ApiError.InvalidSignature.code, message: ApiError.InvalidSignature.message }
      })
  })
})
