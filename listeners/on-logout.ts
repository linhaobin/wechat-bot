import { log } from 'wechaty'

export default async function onLogout(this, user) {
  log.info('Bot', `${user.name()} logouted`)
}
