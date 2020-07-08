import { IsString } from 'class-validator'

import Facility from '../../interfaces/facility.interface'

class CreateFacilityDto implements Facility {
  @IsString()
  public owner?: string;

  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  public promoImage: string;

  constructor (
    facility: Facility = {
      owner: '',
      title: '',
      description: '',
      promoImage: ''
    }
  ) {
    this.owner = facility.owner
    this.title = facility.title
    this.description = facility.description
    this.promoImage = facility.promoImage
  }
}

export default CreateFacilityDto
