import path from 'path'

const rootPath = __dirname

export default {
  rootPath,
  uploadsPath: path.join(rootPath, '../public/uploads')
}
