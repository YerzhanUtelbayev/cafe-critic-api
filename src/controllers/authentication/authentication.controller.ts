import { Router, Request, Response, NextFunction } from 'express'

import Controller from '../../interfaces/controller.interface'
import CreateUserDto from './user.dto'
import AuthenticationService from './authentication.service'
import validationMiddleware from '../../middleware/validation.middleware'

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private AuthenticationService = new AuthenticationService();

  private initializeRoutes () {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    )
  }

  private registration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userData: CreateUserDto = request.body
    try {
      const { cookie, user } = await this.AuthenticationService.register(
        userData
      )
      response.setHeader('Set-Cookie', [cookie])
      response.send(user)
    } catch (error) {
      next(error)
    }
  };
}

export default AuthenticationController
