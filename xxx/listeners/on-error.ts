import { log } from 'wechaty'

export default async function onError(this, user) {
  error => log.info('Bot', 'error: %s', error)
}
