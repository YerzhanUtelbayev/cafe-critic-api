import HttpException from './HttpExceptions'

class UserWithThatEmailExistsException extends HttpException {
  constructor (email: string) {
    super(400, `User with email ${email} already exists`)
  }
}

export default UserWithThatEmailExistsException
