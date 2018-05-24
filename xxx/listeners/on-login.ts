import { log } from 'wechaty'

export default async function onLogin(user: any) {
  log.info('Bot', `${user.name()} logined`)
  this.say(`wechaty logined`)
}
