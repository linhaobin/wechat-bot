import { Contact, FriendRequest } from 'wechaty'

export default async function onFriend(contact: Contact, request: FriendRequest) {
  if (request) {
    // 1. request to be friend from new contact
    let result = await request.accept()
    if (result) {
      console.log(`Request from ${contact.name()} is accept succesfully!`)
    } else {
      console.log(`Request from ${contact.name()} failed to accept!`)
    }
  } else {
    // 2. confirm friend ship
    console.log(`new friendship confirmed with ${contact.name()}`)
  }
}
