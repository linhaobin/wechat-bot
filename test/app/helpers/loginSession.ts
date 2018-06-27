import * as assert from 'assert'
import { Session } from 'egg'
import { app } from './bootstrap'
import { httpRequest, httpRequestSignature } from './httpRequest'

let loginSession: Session
let isReady = false
const callbacks: Array<{
  resolve: (r: any) => void
  reject: (r: any) => void
}> = []

export const getSession = async () => {
  if (loginSession) return loginSession

  const promise = new Promise<Session>((resolve, reject) => {
    callbacks.push({ resolve, reject })
  })

  if (!isReady) {
    requestSession()
  }

  return promise
}

async function requestSession() {
  try {
    isReady = true

    const signInResp = await httpRequest()
      .post('/sign/sign-in')
      .use(httpRequestSignature)
      .type('json')
      .send({
        username: app.config.admin.username,
        password: app.config.admin.initPassword
      })
      .expect(200)

    assert(signInResp.body && !signInResp.body.error)
    const body: Session = signInResp.body
    assert(body.accessToken)
    assert(body.id)
    assert(body.expire)
    assert(body.expireAt)

    loginSession = body

    callbacks.forEach(({ resolve }) => {
      try {
        resolve(loginSession)
      } catch (error) {
        // tslint:disable-next-line
        console.error(error)
      }
    })
  } catch (error) {
    callbacks.forEach(({ reject }) => {
      try {
        reject(error)
      } catch (error) {
        // tslint:disable-next-line
        console.error(error)
      }
    })
  }
}
