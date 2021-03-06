import { Router, Request, Response, NextFunction } from 'express'
import { isString } from 'class-validator'

import Controller from '../../interfaces/controller.interface'
import ReviewService from './review.service'
import CreateReviewDto from './review.dto'
import RequestWithUser from '../../interfaces/RequestWithUser.interface'
import reviewModel from '../../models/review.model'
import authMiddleware from '../../middleware/auth.middleware'
import validationMiddleware from '../../middleware/validation.middleware'
import AuthenticationTokenMissingException from '../../exceptions/AuthenticationTokenMissingException'
import PlaceQueryMissingException from '../../exceptions/PlaceQueryMissingException'
import HttpExceptions from '../../exceptions/HttpExceptions'
import ReviewNotFoundException from '../../exceptions/ReviewNotFoundException'

class ReviewController implements Controller {
  public path = '/reviews';
  public router = Router();
  private ReviewModel = reviewModel;
  private ReviewService = new ReviewService();

  constructor () {
    this.initializeRoutes()
  }

  private initializeRoutes (): void {
    this.router.get(this.path, this.getByFacility)
    this.router.post(
      this.path,
      [authMiddleware, validationMiddleware(CreateReviewDto)],
      this.create
    )
    this.router.delete(`${this.path}/:id`, authMiddleware, this.remove)
  }

  private create = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const reviewData: CreateReviewDto = request.body
    if (!request.user) {
      return next(new AuthenticationTokenMissingException())
    }

    const createdReview = new this.ReviewModel({
      ...reviewData,
      author: request.user._id
    })

    const isRatingUpdated = await this.ReviewService.hasUpdatedFacilityRatingWithNew(
      reviewData
    )
    if (!isRatingUpdated) {
      return next(new HttpExceptions())
    }

    await createdReview.save()
    return response.sendStatus(201)
  };

  private getByFacility = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    if (
      !(request.query && request.query.place) ||
      !isString(request.query.place)
    ) {
      return next(new PlaceQueryMissingException())
    }
    const facilityId = request.query.place
    const reviewDocs = await this.ReviewModel.find({ facility: facilityId })
    return response.send(reviewDocs)
  };

  private remove = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = request.params
    const reviewDoc = await this.ReviewModel.findById(id)
    if (!reviewDoc) {
      return next(new ReviewNotFoundException(id))
    }

    const isRatingUpdated = await this.ReviewService.hasUpdatedFacilityRatingWithDeleted(
      reviewDoc
    )
    if (!isRatingUpdated) {
      return next(new HttpExceptions())
    }

    await reviewDoc.deleteOne()
    return response.send(200)
  };
}

export default ReviewController
