import { IsString } from 'class-validator'
import { ObjectId } from 'mongodb'

import Facility from '../../interfaces/facility.interface'

class CreateFacilityDto implements Facility {
  @IsString()
  public owner?: string | ObjectId;

  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  public promoImage: string;

  @IsString()
  public thumbnail: string;

  constructor (facility: Facility) {
    this.owner = facility.owner
    this.title = facility.title
    this.description = facility.description
    this.promoImage = facility.promoImage
    this.thumbnail = facility.thumbnail
  }
}

export default CreateFacilityDto
