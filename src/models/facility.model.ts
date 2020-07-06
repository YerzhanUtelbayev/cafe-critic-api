import mongoose from 'mongoose'

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
  ratings: RatingsSchema
})

const Facility = mongoose.model('Facility', FacilitySchema)

export default Facility
