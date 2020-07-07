import mongoose from 'mongoose'
import Review from '../interfaces/review.interface'

const { Schema } = mongoose

const ReviewSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    facility: {
      type: Schema.Types.ObjectId,
      ref: 'Facility',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    foodQuality: Number,
    serviceQuality: Number,
    interior: Number
  },
  { timestamps: true }
)

const reviewModel = mongoose.model<Review & mongoose.Document>('Review', ReviewSchema)

export default reviewModel
