import { Context } from 'egg'
import { isSafeInteger, toNumber } from 'lodash'
import ApiError from '../errors/api_error'
import helper from '../extend/helper'

export const SESSION_ID_KEY = 'auth-session-id'
export const SIGNATURE_KEY = 'auth-signature'
export const TIMESTAMP_KEY = 'auth-timestamp'
export const NONCE_KEY = 'auth-nonce'

const MAX_DIFF_TS = 5 * 60 * 1000 // 5分钟

export default () => {
  return async function userRequired(ctx: Context, next) {
    const sessionId = ctx.get(SESSION_ID_KEY)
    const timestamp = ctx.get(TIMESTAMP_KEY)
    const nonce = ctx.get(NONCE_KEY)
    const signature = ctx.headers[SIGNATURE_KEY]

    // const hashSign = sessionId || signature || timestamp || nonce
    // if (!hashSign) {
    //   await next()
    //   return
    // }

    // 校验timestamp，不能与当前时间前后相差5分钟
    if (!timestamp || !isSafeInteger(toNumber(timestamp))) throw ApiError.InvalidSignature
    const diffNow = Date.now() - +timestamp
    if (diffNow > MAX_DIFF_TS) throw ApiError.InvalidSignature

    if (sessionId) {
      checkHahSession(ctx, { sessionId, timestamp, nonce, signature })
    } else {
      checkNotHahSession({ timestamp, nonce, signature })
    }
    // TODO: 缓存signature，判断是否已使用，防止重放

    await next()
  }
}

async function checkHahSession(ctx: Context, { sessionId, timestamp, nonce, signature }) {
  // 根据SessionId 获取Session
  const session = await ctx.service.sign.getSessionBySessionId(sessionId)

  // 没有对应session也当作签名错误
  if (!session) {
    throw ApiError.InvalidSignature
  }

  const okSignature = genSignature(session.accessToken, nonce, timestamp)

  // 签名错误
  if (signature !== okSignature) {
    throw ApiError.InvalidSignature
  }

  ctx.session = session
}
// 检查有sessionId
async function checkNotHahSession({ timestamp, nonce, signature }) {
  const okSignature = genSignature(nonce, timestamp)

  // 签名错误
  if (signature !== okSignature) {
    throw ApiError.InvalidSignature
  }
}

export function genSignature(...args) {
  const hashCode = args.sort().join('')
  return helper.sha1(hashCode)
}
