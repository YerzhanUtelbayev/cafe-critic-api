import { Router, Response, NextFunction } from 'express'

import Controller from '../../interfaces/controller.interface'
import CreateReviewDto from './review.dto'
import RequestWithUser from '../../interfaces/RequestWithUser.interface'
import reviewModel from '../../models/review.model'
import AuthenticationTokenMissingException from '../../exceptions/AuthenticationTokenMissingException'
import authMiddleware from '../../middleware/auth.middleware'
import validationMiddleware from '../../middleware/validation.middleware'

class ReviewController implements Controller {
  public path = '/reviews';
  public router = Router();
  private ReviewModel = reviewModel;

  constructor () {
    this.initializeRoutes()
  }

  private initializeRoutes (): void {
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
}

export default ReviewController
