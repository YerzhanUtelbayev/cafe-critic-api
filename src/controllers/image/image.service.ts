import { ObjectId } from 'mongodb'

import facilityModel from '../../models/facility.model'

class ImageService {
  private FacilityModel = facilityModel;

  public incrementFacilityImagesNumber = async (facilityId: string | ObjectId): Promise<void> => {
    const facilityDoc = await this.FacilityModel.findById(facilityId)
    if (!facilityDoc) return
    const prevNumber = facilityDoc.get('imagesNumber')
    facilityDoc.set('imagesNumber', prevNumber + 1)
    await facilityDoc.save()
  };
}

export default ImageService
