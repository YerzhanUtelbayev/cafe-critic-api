import * as express from 'express'
import User from '../../src/interfaces/user.interface'

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
