import { log } from 'wechaty'

export default async function onLogout(user: any) {
  log.info('Bot', `${user.name()} logouted`)
}
