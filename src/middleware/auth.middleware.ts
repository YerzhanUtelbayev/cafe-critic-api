import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException'
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException'
import DataStoredInToken from '../interfaces/dataStoredInToken.interface'
import userModel from '../models/user.model'

import RequestWithUser from '../interfaces/RequestWithUser.interface'

async function authMiddleware (
  request: RequestWithUser,
  response: Response,
  next: NextFunction
): Promise<void> {
  const headerToken = request.get('authorization')
  if (headerToken && process.env.JWT_SECRET) {
    // TODO: add exception for undefined process.env.JWT_SECRET
    const secret = process.env.JWT_SECRET
    const token = headerToken.startsWith('Bearer ')
      ? headerToken.slice(7, headerToken.length)
      : headerToken
    try {
      const verificationResponse = (await jwt.verify(
        token,
        secret
      )) as DataStoredInToken
      const id = verificationResponse._id
      const user = await userModel.findById(id)

      if (user) {
        request.user = user
        return next()
      } else {
        return next(new WrongAuthenticationTokenException())
      }
    } catch (error) {
      return next(new WrongAuthenticationTokenException())
    }
  } else {
    return next(new AuthenticationTokenMissingException())
  }
}

export default authMiddleware
