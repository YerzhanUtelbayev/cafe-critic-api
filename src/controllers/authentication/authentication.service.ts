import * as jwt from 'jsonwebtoken'

import DataStoredInToken from '../../interfaces/dataStoredInToken.interface'
import TokenData from '../../interfaces/tokenData.interface'
import User from '../../interfaces/user.interface'
import userModel from '../../models/user.model'
import CreateUserDto from './user.dto'
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailExistsException'

class AuthenticationService {
  public UserModel = userModel;

  public async register (userData: CreateUserDto):Promise<void> {
    const userDoc = await this.UserModel.findOne({ email: userData.email })
    if (userDoc) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email)
    }
    await this.UserModel.create(userData)
  }

  public createCookie (tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`
  }

  public createToken (id: string): TokenData {
    const expiresIn = 60 * 60
    const secret = process.env.JWT_SECRET || 'defaultsecret' // TODO: add exception for undefined process.env.JWT_SECRET
    const dataStoredInToken: DataStoredInToken = {
      _id: id
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    }
  }
}

export default AuthenticationService
