import { Request, Response, Router, NextFunction } from 'express'

import Controller from '../../interfaces/controller.interface'
import Facility from '../../interfaces/facility.interface'
import RequestWithUser from '../../interfaces/RequestWithUser.interface'
import authMiddleware from '../../middleware/auth.middleware'
import validationMiddleware from '../../middleware/validation.middleware'
import CreateFacilityDto from './facility.dto'
import facilityModel from '../../models/facility.model'
import FacilityNotFoundException from '../../exceptions/FacilityNotFoundException'

class FacilityController implements Controller {
  public path = '/places';
  public router = Router();
  private FacilityModel = facilityModel;

  constructor () {
    this.initializeRoutes()
  }

  private initializeRoutes (): void {
    this.router.get(this.path, this.getAll)
    this.router.get(`${this.path}/:id`, this.getById)
    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(CreateFacilityDto),
      this.create
    )
    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreateFacilityDto, true),
      this.update
    )
  }

  private create = async (
    request: RequestWithUser,
    response: Response
  ): Promise<Response> => {
    const facilityData: CreateFacilityDto = request.body
    if (request.user) {
      const createdFacility = new this.FacilityModel({
        ...facilityData,
        owner: request.user._id
      })
      await createdFacility.save()
    }
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
  ) => {
    const { id } = request.params
    const facilityData: Facility = request.body
    const facilityDoc = this.FacilityModel.findByIdAndUpdate(id, facilityData, {
      new: true
    })
    if (facilityDoc) {
      response.send(facilityDoc)
    } else {
      next(new FacilityNotFoundException(id))
    }
  };
}

export default FacilityController
