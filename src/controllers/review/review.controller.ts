import { Router, Request, Response, NextFunction } from 'express'
import { isString } from 'class-validator'

import Controller from '../../interfaces/controller.interface'
import CreateReviewDto from './review.dto'
import RequestWithUser from '../../interfaces/RequestWithUser.interface'
import reviewModel from '../../models/review.model'
import authMiddleware from '../../middleware/auth.middleware'
import validationMiddleware from '../../middleware/validation.middleware'
import AuthenticationTokenMissingException from '../../exceptions/AuthenticationTokenMissingException'
import PlaceQueryMissingException from '../../exceptions/PlaceQueryMissingException'

class ReviewController implements Controller {
  public path = '/reviews';
  public router = Router();
  private ReviewModel = reviewModel;

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
}

export default ReviewController
