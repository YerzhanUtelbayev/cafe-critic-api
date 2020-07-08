import { IsOptional, IsString, ValidateNested } from 'class-validator'

import CreateAddressDto from './address.dto'
import User from '../../interfaces/user.interface'

class CreateUserDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public avatarImage: string;

  @IsString()
  public role: string;

  @IsOptional()
  @ValidateNested()
  public address?: CreateAddressDto;

  constructor (
    user: User = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      avatarImage: '',
      role: '',
      address: {
        street: '',
        city: '',
        country: ''
      }
    }
  ) {
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.password = user.password
    this.address = user.address
    this.avatarImage = user.avatarImage
    this.role = user.role
  }
}

export default CreateUserDto