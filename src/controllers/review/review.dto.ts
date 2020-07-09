import { IsString, IsInt, Min, Max } from 'class-validator'

import Review from '../../interfaces/review.interface'

class CreateReviewDto implements Review {
  @IsString()
  public facility: string

  @IsString()
  public description: string

  @IsInt()
  @Min(1)
  @Max(5)
  public foodQuality: number

  @IsInt()
  @Min(1)
  @Max(5)
  public serviceQuality: number

  @IsInt()
  @Min(1)
  @Max(5)
  public interior: number

  constructor (
    review: Review
  ) {
    this.facility = review.facility
    this.description = review.description
    this.foodQuality = review.foodQuality
    this.serviceQuality = review.serviceQuality
    this.interior = review.interior
  }
}

export default CreateReviewDto
