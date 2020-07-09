import { IsString } from 'class-validator'

class LoginDto {
  @IsString()
  public email: string

  @IsString()
  public password: string;

  constructor (user = {
    email: '',
    password: ''
  }) {
    this.email = user.email
    this.password = user.password
  }
}

export default LoginDto
