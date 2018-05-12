import { Message, Room } from 'wechaty'

export default async function onMessage(message: Message): Promise<void> {
  try {
    const room = message.room()
    const sender = message.from()
    const content = message.content()

    console.log((room ? '[' + room.topic() + ']' : '') + '<' + sender.name() + '>' + ':' + message)

    if (message.self() || room) {
      console.log('message is sent from myself, or inside a room.')
      return
    }

    /********************************************
     *
     * 从下面开始修改vvvvvvvvvvvv
     *
     */

    if (content === 'ding') {
      await message.say('thanks for ding me')

      const myRoom = await Room.find({
        topic: 'ding'
      })
      if (!myRoom) return

      if (myRoom.has(sender)) {
        await sender.say('no need to ding again, because you are already in ding room')
        return
      }

      await sender.say('ok, I will put you in ding room!')
      await myRoom.add(sender)
      return
    } else if (content === 'dong') {
      await sender.say('ok, dong me is welcome, too.')
      return
    }

    /**
     *
     * 到这里结束修改^^^^^^^^^^^^
     *
     */
    /*********************************************/
  } catch (e) {
    console.error(e)
  }
}
