import * as jwt from 'jsonwebtoken'

import DataStoredInToken from '../../interfaces/dataStoredInToken.interface'
import TokenData from '../../interfaces/tokenData.interface'
import User from '../../interfaces/user.interface'
import userModel from '../../models/user.model'
import CreateUserDto from './user.dto'
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailExistsException'

interface IRegisterData {
  cookie: string
  user: User
}

class AuthenticationService {
  public UserModel = userModel;

  public async register (userData: CreateUserDto):Promise<IRegisterData> {
    if (await this.UserModel.findOne({ email: userData.email })) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email)
    }
    const user = await this.UserModel.create(userData)
    const tokenData = this.createToken(user._id)
    const cookie = this.createCookie(tokenData)
    return {
      cookie,
      user
    }
  }

  public createCookie (tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`
  }

  public createToken (id: string): TokenData {
    const expiresIn = 60 * 60
    const secret = process.env.JWT_SECRET || 'hhhhhh'
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
