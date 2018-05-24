import { log, Room, Contact } from 'wechaty'

export default async function onRoomTopic(room: Room, topic: string, oldTopic: string, changer: Contact) {
  console.log(`Room ${room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
}
