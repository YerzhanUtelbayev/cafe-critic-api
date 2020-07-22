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

const fileFilter = (request: Express.Request, file: Express.Multer.File, cb: CallableFunction) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
  }
}

const upload = multer({ storage, fileFilter })

export default upload
