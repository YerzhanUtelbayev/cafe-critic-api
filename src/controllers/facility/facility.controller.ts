import { Request, Response, Router } from 'express'

import Controller from '../../interfaces/controller.interface'
import authMiddleware from '../../middleware/auth.middleware'
import validationMiddleware from '../../middleware/validation.middleware'
import CreateFacilityDto from './facility.dto'
// import Facility from '../../interfaces/facility.interface'
import facilityModel from '../../models/facility.model'
import RequestWithUser from '../../interfaces/RequestWithUser.interface'

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
    this.router.post(this.path, authMiddleware, validationMiddleware(CreateFacilityDto), this.create)
  }

  private create = async (request: RequestWithUser, response: Response): Promise<Response> => {
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
}

export default FacilityController
