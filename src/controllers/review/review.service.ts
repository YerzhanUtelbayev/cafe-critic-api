import facilityModel from '../../models/facility.model'
import { getRoundedToTwoDecimal } from '../../utilities/utilities'

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

  private getOverall (ratings: IRating): number {
    const sumAverage =
      (ratings.foodQuality + ratings.serviceQuality + ratings.interior) / 3
    return getRoundedToTwoDecimal(sumAverage)
  }

  private getUpdatedFacilityProps = (summedRatings:IRating, rating:IRating):IRating => {
    const total = summedRatings.reviewsNumber ? summedRatings.reviewsNumber + 1 : 1
    return {
      reviewsNumber: total,
      foodQuality: getRoundedToTwoDecimal((summedRatings.foodQuality + rating.foodQuality) / total),
      serviceQuality: getRoundedToTwoDecimal((summedRatings.serviceQuality + rating.serviceQuality) / total),
      interior: getRoundedToTwoDecimal((summedRatings.interior + rating.interior) / total)
    }
  }

  public updateFacilityAverageRatingWithNew = async (
    facilityId: string,
    ratings: IRating
  ): Promise<boolean> => {
    const facilityDoc = await this.FacilityModel.findById(facilityId)
    if (!facilityDoc) return false

    if (facilityDoc.reviewsNumber === 0) {
      facilityDoc.ratings = {
        overall: this.getOverall(ratings),
        food: ratings.foodQuality,
        service: ratings.serviceQuality,
        interior: ratings.interior
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
      const updatedRatings = this.getUpdatedFacilityProps(summedRatings, ratings)
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
