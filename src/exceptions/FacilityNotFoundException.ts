import HttpException from './HttpExceptions'

class FacilityNotFoundException extends HttpException {
  constructor (id: string) {
    super(404, `Post with id ${id} not found`)
  }
}

export default FacilityNotFoundException
