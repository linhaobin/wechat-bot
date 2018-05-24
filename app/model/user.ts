import { Application } from 'egg'
import { Document, Model } from 'mongoose'

export interface User {
  username: string
  password: string
}

export type UserDocument = User & Document
export type UserModel = Model<UserDocument>

export default (app: Application): UserModel => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const userSchema = new Schema({
    username: { type: String },
    password: { type: String }
  })

  userSchema.index({ username: 1 }, { unique: true })

  return mongoose.model('User', userSchema)
}
