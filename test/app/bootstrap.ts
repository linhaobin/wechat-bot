import mock from 'egg-mock'
// tslint:disable-next-line
import { Request } from 'superagent'
// tslint:disable-next-line
import { SuperTest, Test } from 'supertest'

import {
  genSignature,
  NONCE_KEY,
  SESSION_ID_KEY,
  SIGNATURE_KEY,
  TIMESTAMP_KEY
} from '../../app/middleware/signature_handler'

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

interface HttpRequestSignature {
  (request: Request): void
  (signatures: Signature): (request: Request) => void
}
interface Signature {
  sessionId: string
  accessToken: string
}
const httpRequestSignature = ((option: Signature | Request) => {
  if (isSignature(option)) {
    return (request: Request) => {
      setSignature(request, option)
    }
  }
  setSignature(option)
}) as HttpRequestSignature

function isSignature(value): value is Signature {
  if (value && value.sessionId && value.accessToken) {
    return true
  }
  return false
}

function setSignature(request: Request, signatures?: Signature) {
  const timestamp = Date.now() + ''
  const nonce = Date.now() + ''
  const args = [timestamp, nonce]
  if (signatures) {
    args.push(signatures.sessionId)
    args.push(signatures.accessToken)
  }

  const signature = genSignature(...args)
  const headers = {
    [TIMESTAMP_KEY]: timestamp,
    [NONCE_KEY]: nonce,
    [SIGNATURE_KEY]: signature
  }

  if (signatures) {
    headers[SESSION_ID_KEY] = signatures.sessionId
  }

  request.set(headers)
}

export { app, httpRequest, httpRequestSignature }
