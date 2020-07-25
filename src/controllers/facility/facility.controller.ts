import { Request, Response, Router, NextFunction } from 'express'

import Controller from '../../interfaces/controller.interface'
import Facility from '../../interfaces/facility.interface'
import RequestWithUser from '../../interfaces/RequestWithUser.interface'
import CreateFacilityDto from './facility.dto'
import FacilityService from './facility.service'
import facilityModel from '../../models/facility.model'
import authMiddleware from '../../middleware/auth.middleware'
import validationMiddleware from '../../middleware/validation.middleware'
import upload from '../../middleware/multerStorage.middleware'
import FacilityNotFoundException from '../../exceptions/FacilityNotFoundException'
import AuthenticationTokenMissingException from '../../exceptions/AuthenticationTokenMissingException'

class FacilityController implements Controller {
  public path = '/places';
  public router = Router();
  private FacilityModel = facilityModel;
  private FacilityService = new FacilityService()

  constructor () {
    this.initializeRoutes()
  }

  private initializeRoutes (): void {
    this.router.get(this.path, this.getAll)
    this.router.get(`${this.path}/:id`, this.getById)
    this.router.post(
      this.path,
      [
        authMiddleware,
        validationMiddleware(CreateFacilityDto),
        upload.single('promoImage')
      ],
      this.create
    )
    this.router.patch(
      `${this.path}/:id`,
      [
        authMiddleware,
        validationMiddleware(CreateFacilityDto, true),
        upload.single('promoImage')
      ],
      this.update
    )
  }

  private create = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { body, file, user } = request
    const facilityData: CreateFacilityDto = body
    if (!user) {
      return next(new AuthenticationTokenMissingException())
    }

    const thumbnailName = this.FacilityService.saveThumbnail(file)

    const createdFacility = new this.FacilityModel({
      ...facilityData,
      promoImage: file.filename,
      thumbnail: thumbnailName,
      owner: user._id
    })
    await createdFacility.save()
    return response.sendStatus(201)
  };

  private getAll = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const facilityDocs = await this.FacilityModel.find()
    return response.send(facilityDocs)
  };

  private getById = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { id } = request.params
    const post = await this.FacilityModel.findById(id)
    return response.send(post)
  };

  private update = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = request.params
    const facilityData: Facility = request.body
    const facilityDoc = this.FacilityModel.findByIdAndUpdate(id, facilityData, {
      new: true
    })
    if (facilityDoc) {
      return response.send(facilityDoc)
    } else {
      next(new FacilityNotFoundException(id))
    }
  };
}

export default FacilityController
