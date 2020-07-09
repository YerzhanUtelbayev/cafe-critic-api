import mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

import User from '../interfaces/user.interface'

const SALT_WORK_FACTOR = 10
const { Schema } = mongoose

export interface IUserDocument extends mongoose.Document {
  checkPassword(password: string): Promise<boolean>;
}

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

userSchema.pre('save', async function encryptIntoHash (next) {
  if (!this.isModified('password')) return next()

  const plainPassword = this.get('password')
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
  const hash = await bcrypt.hash(plainPassword, salt)
  this.set('password', hash)
  return next()
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password
    return ret
  }
})

userSchema.methods.checkPassword = async function checkPassword (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password)
}

userSchema.virtual('fullName').get(function (this: User): string {
  return `${this.firstName} ${this.lastName}`
})

const userModel = mongoose.model<User & IUserDocument>('User', userSchema)

export default userModel
