import { Document } from 'mongoose'
import facilityModel from '../../models/facility.model'
import CreateReviewDto from './review.dto'
import Review from '../../interfaces/review.interface'
import { getRoundedToTwoDecimal } from '../../utilities/utilities'

interface IRating {
  reviewsNumber: number;
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

  private getUpdatedFacilityPropsWithNew = (
    summedRatings: IRating,
    reviewData: CreateReviewDto
  ): IRating => {
    const total = summedRatings.reviewsNumber + 1
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

  private getUpdatedFacilityPropsWithDeleted = (
    summedRatings: IRating,
    reviewDoc: Review & Document
  ): IRating => {
    const total = summedRatings.reviewsNumber - 1
    return {
      reviewsNumber: total,
      foodQuality: getRoundedToTwoDecimal(
        (summedRatings.foodQuality - reviewDoc.get('foodQuality')) / total
      ),
      serviceQuality: getRoundedToTwoDecimal(
        (summedRatings.serviceQuality - reviewDoc.get('serviceQuality')) / total
      ),
      interior: getRoundedToTwoDecimal(
        (summedRatings.interior - reviewDoc.get('interior')) / total
      )
    }
  };

  public hasUpdatedFacilityRatingWithNew = async (
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

    if (facilityDoc.reviewsNumber && facilityDoc.ratings) {
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
      const updatedRatings = this.getUpdatedFacilityPropsWithNew(
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

  public hasUpdatedFacilityRatingWithDeleted = async (
    reviewDoc: Review & Document
  ): Promise<boolean> => {
    const facilityDoc = await this.FacilityModel.findById(
      reviewDoc.get('facility', String)
    )
    if (!facilityDoc || facilityDoc.reviewsNumber === 0) return false

    if (facilityDoc.reviewsNumber === 1) {
      facilityDoc.reviewsNumber = 0
      facilityDoc.ratings = {
        overall: 0,
        food: 0,
        service: 0,
        interior: 0
      }
      await facilityDoc.save()
      return true
    }

    if (
      facilityDoc.reviewsNumber &&
      facilityDoc.reviewsNumber > 1 &&
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
      const updatedRatings = this.getUpdatedFacilityPropsWithDeleted(
        summedRatings,
        reviewDoc
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
