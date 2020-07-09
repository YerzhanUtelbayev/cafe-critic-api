import facilityModel from '../../models/facility.model'
import { getRoundedToTwoDecimal } from '../../utilities/utilities'
import CreateReviewDto from './review.dto'

interface IRating {
  reviewsNumber?: number;
  foodQuality: number;
  serviceQuality: number;
  interior: number;
}

class ReviewService {
  private FacilityModel = facilityModel;

  private getSummedRatings (
    reviewsNumber: number,
    foodQuality: number,
    serviceQuality: number,
    interior: number
  ): IRating {
    return {
      reviewsNumber: reviewsNumber,
      foodQuality: reviewsNumber * foodQuality,
      serviceQuality: reviewsNumber * serviceQuality,
      interior: reviewsNumber * interior
    }
  }

  private getOverall (ratings: CreateReviewDto | IRating): number {
    const sumAverage =
      (ratings.foodQuality + ratings.serviceQuality + ratings.interior) / 3
    return getRoundedToTwoDecimal(sumAverage)
  }

  private getUpdatedFacilityProps = (
    summedRatings: IRating,
    reviewData: CreateReviewDto
  ): IRating => {
    const total = summedRatings.reviewsNumber
      ? summedRatings.reviewsNumber + 1
      : 1
    return {
      reviewsNumber: total,
      foodQuality: getRoundedToTwoDecimal(
        (summedRatings.foodQuality + reviewData.foodQuality) / total
      ),
      serviceQuality: getRoundedToTwoDecimal(
        (summedRatings.serviceQuality + reviewData.serviceQuality) / total
      ),
      interior: getRoundedToTwoDecimal(
        (summedRatings.interior + reviewData.interior) / total
      )
    }
  };

  public hasUpdatedFacilityAverageRatingWithNew = async (
    reviewData: CreateReviewDto
  ): Promise<boolean> => {
    const facilityDoc = await this.FacilityModel.findById(reviewData.facility)
    if (!facilityDoc) return false

    if (facilityDoc.reviewsNumber === 0) {
      facilityDoc.ratings = {
        overall: this.getOverall(reviewData),
        food: reviewData.foodQuality,
        service: reviewData.serviceQuality,
        interior: reviewData.interior
      }
      facilityDoc.reviewsNumber = 1
      await facilityDoc.save()
      return true
    }

    if (
      facilityDoc.reviewsNumber &&
      facilityDoc.reviewsNumber > 0 &&
      facilityDoc.ratings
    ) {
      const {
        reviewsNumber,
        ratings: { food, service, interior }
      } = facilityDoc
      const summedRatings = this.getSummedRatings(
        reviewsNumber,
        food,
        service,
        interior
      )
      const updatedRatings = this.getUpdatedFacilityProps(
        summedRatings,
        reviewData
      )
      facilityDoc.reviewsNumber = updatedRatings.reviewsNumber
      facilityDoc.ratings = {
        overall: this.getOverall(updatedRatings),
        food: updatedRatings.foodQuality,
        service: updatedRatings.serviceQuality,
        interior: updatedRatings.interior
      }
      await facilityDoc.save()
      return true
    }

    return false
  };
}

export default ReviewService
