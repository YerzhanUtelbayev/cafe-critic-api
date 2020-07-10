import path from 'path'

import multer from 'multer'
import { nanoid } from 'nanoid'

import config from '../config'

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, config.uploadsPath)
  },
  filename: (request, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

export default upload
