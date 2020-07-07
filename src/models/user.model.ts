import mongoose from 'mongoose'

import User from '../interfaces/user.interface'

const { Schema } = mongoose

const addressSchema = new Schema({
  city: String,
  country: String,
  street: String
})

const userSchema = new Schema(
  {
    address: addressSchema,
    email: String,
    username: {
      type: String,
      required: true,
      unique: true
    },
    firstName: String,
    lastName: String,
    password: {
      type: String,
      required: true
    },
    avatarImage: String,
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'admin']
    }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    }
  }
)

userSchema.virtual('fullName').get(function (this: User): string {
  return `${this.firstName} ${this.lastName}`
})

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema)

export default userModel
