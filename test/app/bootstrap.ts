import mock from 'egg-mock'
// tslint:disable-next-line
import { Request } from 'superagent'
// tslint:disable-next-line
import { SuperTest, Test } from 'supertest'

import { genSignature, NONCE_KEY, SIGNATURE_KEY, TIMESTAMP_KEY } from '../../app/middleware/signature_handler'

const options: any = {}
if (process.env.EGG_BASE_DIR) options.baseDir = process.env.EGG_BASE_DIR
const app = mock.app(options)

before(() => app.ready())
afterEach(mock.restore)

// type App = typeof app
// interface MockApp extends App {
//   myHttpRequest(): string
// }

// (app as MockApp).myHttpRequest = () => {
//   const httpRequest: supertest.SuperTest<supertest.Test> = app.httpRequest()
//   return httpRequest.he
// }
const httpRequest = () => app.httpRequest() as SuperTest<Test>

const httpRequestSignature = (request: Request) => {
  const timestamp = Date.now() + ''
  const nonce = Date.now() + ''
  const signature = genSignature(timestamp, nonce)
  request.set({
    [TIMESTAMP_KEY]: timestamp,
    [NONCE_KEY]: nonce,
    [SIGNATURE_KEY]: signature
  })
}

export { app, httpRequest, httpRequestSignature }
