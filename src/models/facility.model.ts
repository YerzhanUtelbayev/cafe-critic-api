import mongoose, { Document, Model, FilterQuery } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

import Facility from '../interfaces/facility.interface'

const { Schema } = mongoose

const RatingsSchema = new Schema({
  overall: Number,
  food: Number,
  service: Number,
  interior: Number
})

const FacilitySchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  promoImage: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  reviewsNumber: { type: Number, default: 0 },
  imagesNumber: { type: Number, default: 0 },
  ratings: RatingsSchema
})

FacilitySchema.plugin(mongoosePaginate)

interface IFacilityModel extends Model<Facility & Document> {
  paginate(
    query?: FilterQuery<Facility>,
    options?: mongoose.PaginateOptions
  ): Promise<mongoose.PaginateResult<Facility[]>>;
}
// TODO: Check mongoose static methods typing.

const facilityModel: IFacilityModel = mongoose.model<
  Facility & Document,
  IFacilityModel
>('Facility', FacilitySchema)

export default facilityModel
