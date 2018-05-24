import { Wechaty } from 'wechaty'

Wechaty.instance()
  .on('scan', './listeners/on-scan')
  .on('login', './listeners/on-login')
  .on('logout', './listeners/on-logout')
  .on('error', './listeners/on-error')
  .on('message', './listeners/on-message')
  .on('friend', './listeners/on-friend')
  .on('room-join', './listeners/on-room-join')
  .on('room-leave', './listeners/on-room-leave')
  .on('room-topic', './listeners/on-room-topic')

  .start()
  .catch(e => console.error(e))
