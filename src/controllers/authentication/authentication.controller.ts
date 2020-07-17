import { Router, Request, Response, NextFunction } from 'express'

import Controller from '../../interfaces/controller.interface'
import AuthenticationService from './authentication.service'
import CreateUserDto from './user.dto'
import userModel from '../../models/user.model'
import validationMiddleware from '../../middleware/validation.middleware'
import upload from '../../middleware/multerStorage.middleware'
import LoginDto from './loginDto'
import WrongCredentialsException from '../../exceptions/WrongCredentialsException'

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private AuthenticationService = new AuthenticationService();
  private UserModel = userModel;

  constructor () {
    this.initializeRoutes()
  }

  private initializeRoutes () {
    this.router.post(
      `${this.path}/register`,
      upload.single('avatarImage'),
      this.registration
    )
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginDto),
      this.signIn
    )
  }

  private registration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { body } = request
    if (request.file && request.file.filename) {
      body.avatarImage = request.file.filename
      body.address = {
        city: body.city || '',
        street: body.street || '',
        country: body.country || ''
      }
    }
    const userData: CreateUserDto = body
    try {
      await this.AuthenticationService.register(userData)
      return response.sendStatus(201)
    } catch (error) {
      return next(error)
    }
  };

  private signIn = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const loginData: LoginDto = request.body
    const user = await this.UserModel.findOne({ email: loginData.email })
    if (!user) {
      return next(new WrongCredentialsException())
    }

    const isPasswordMatching = await user.checkPassword(loginData.password)
    if (!isPasswordMatching) {
      return next(new WrongCredentialsException())
    }

    const tokenData = this.AuthenticationService.createToken(user._id)
    response.setHeader('Authorization', 'Bearer ' + tokenData)
    return response.send(user)
  };

  // TODO: Add sign out. Have DB of no longer active tokens that still have some time to live. Query provided token against The Blacklist on every authorized request
}

export default AuthenticationController
