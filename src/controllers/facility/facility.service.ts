import path from 'path'
import sharp from 'sharp'

class FacilityService {
  private getThumbnailName = (file: Express.Multer.File): string => {
    const extension = path.extname(file.filename)
    const fileName = path.basename(file.filename, extension)
    return `thumbnail-${fileName}`
  }

  public saveThumbnail = async (file: Express.Multer.File): Promise<string> => {
    const thumbnailName = this.getThumbnailName(file)
    await sharp(file.path)
      .resize(400, 300)
      .webp()
      .toFile('public/uploads/' + thumbnailName)
    return thumbnailName
  };
}

export default FacilityService
