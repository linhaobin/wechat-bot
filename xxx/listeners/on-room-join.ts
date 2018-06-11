import { Room, Contact } from 'wechaty'

export default async function onRoomJoin(room: Room, inviteeList: Contact[], inviter: Contact) {
  const nameList = inviteeList.map(c => c.name()).join(',')
  console.log(`Room ${room.topic()} got new member ${nameList}, invited by ${inviter}`)
}
