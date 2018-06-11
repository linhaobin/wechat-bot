import { log } from 'wechaty'

export default async function onError(this) {
  error => log.info('Bot', 'error: %s', error)
}
