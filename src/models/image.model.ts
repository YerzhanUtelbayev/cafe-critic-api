import mongoose from 'mongoose'

import Image from '../interfaces/image.interface'

const { Schema } = mongoose

const ImageSchema = new Schema({
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
  image: {
    type: String,
    required: true
  }
})

const imageModel = mongoose.model<Image & mongoose.Document>('Image', ImageSchema)

export default imageModel
