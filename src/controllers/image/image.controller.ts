import { Router, Request, Response, NextFunction } from 'express'
import { isString } from 'class-validator'

import Controller from '../../interfaces/controller.interface'
import imageModel from '../../models/image.model'
import PlaceQueryMissingException from '../../exceptions/PlaceQueryMissingException'

class ImageController implements Controller {
  public path = '/places';
  public router = Router();
  private ImageModel = imageModel;

  constructor () {
    this.initializeRoutes()
  }

  private initializeRoutes (): void {
    this.router.get(this.path, this.getByFacility)
  }

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
    this.ImageModel.find({ facility: facilityId })

    return response.send()
  };
}

export default ImageController
