import { IsString } from 'class-validator'

class CreateAddressDto {
  @IsString()
  public street: string;

  @IsString()
  public city: string;

  @IsString()
  public country: string;

  constructor (address = {
    street: '',
    city: '',
    country: ''
  }) {
    this.street = address.street
    this.city = address.city
    this.country = address.country
  }
}

export default CreateAddressDto
