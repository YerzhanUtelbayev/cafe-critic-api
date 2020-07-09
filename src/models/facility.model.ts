import mongoose from 'mongoose'

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
  ratingsNumber: Number,
  ratings: RatingsSchema
})

const facilityModel = mongoose.model<Facility & mongoose.Document>('Facility', FacilitySchema)

export default facilityModel
