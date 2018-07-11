import { IoContext } from 'egg'

export default () => {
  return async (ctx: IoContext, next) => {
    ctx.logger.info('io connect')
    if (1 !== 1) {
      ctx.socket.disconnect()
      return
    }

    ctx.socket.emit('news', '13213')
    await next()
  }
}
