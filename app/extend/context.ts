import { Context } from 'egg'

export function success(this: Context, data?: any) {
  if (!data) {
    this.status = 204
    return
  }
  this.status = 200
  this.body = data
}
