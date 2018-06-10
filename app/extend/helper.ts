import * as crypto from 'crypto'
import { ApiError } from '../errors/api_error'

const hash = (method: string, data: string, format?) => {
  const sum = crypto.createHash(method)
  sum.update(data, 'utf8')
  return sum.digest(format || 'hex')
}

const sha1 = (data, format?) => hash('sha1', data, format)

export default {
  ApiError,
  hash,
  sha1
}
