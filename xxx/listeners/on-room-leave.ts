import { Room, Contact } from 'wechaty'

export default async function onRoomLeave(room: Room, leaverList: Contact[]) {
  const nameList = leaverList.map(c => c.name()).join(',')
  console.log(`Room ${room.topic()} lost member ${nameList}`)
}
