import { Router, Request, Response, NextFunction } from 'express'
import { isString } from 'class-validator'

import Controller from '../../interfaces/controller.interface'
import ImageService from './image.service'
import imageModel from '../../models/image.model'
import RequestWithUser from '../../interfaces/RequestWithUser.interface'
import CreateImageDto from './image.dto'
import authMiddleware from '../../middleware/auth.middleware'
import validationMiddleware from '../../middleware/validation.middleware'
import upload from '../../middleware/multerStorage.middleware'
import PlaceQueryMissingException from '../../exceptions/PlaceQueryMissingException'
import AuthenticationTokenMissingException from '../../exceptions/AuthenticationTokenMissingException'

class ImageController implements Controller {
  public path = '/images';
  public router = Router();
  private ImageModel = imageModel;
  private ImageService = new ImageService();

  constructor () {
    this.initializeRoutes()
  }

  private initializeRoutes (): void {
    this.router.get(this.path, this.getByFacility)
    this.router.post(
      this.path,
      [
        authMiddleware,
        upload.single('image'),
        validationMiddleware(CreateImageDto)
      ],
      this.create
    )
  }

  private create = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const imageData: CreateImageDto = request.body
    if (!request.user) {
      return next(new AuthenticationTokenMissingException())
    }

    await this.ImageService.incrementFacilityImagesNumber(imageData.facility)

    const createdImage = new this.ImageModel({
      ...imageData,
      author: request.user._id
    })
    await createdImage.save()
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
    const imageDocs = await this.ImageModel.find({ facility: facilityId })

    return response.send(imageDocs)
  };
}

export default ImageController
