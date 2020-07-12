import { IsString } from 'class-validator'
import { ObjectId } from 'mongodb'

import Image from '../../interfaces/image.interface'

class CreateImageDto implements Image {
  @IsString()
  facility: string | ObjectId

  @IsString()
  image: string

  constructor (
    image: Image
  ) {
    this.facility = image.facility
    this.image = image.image
  }
}

export default CreateImageDto
