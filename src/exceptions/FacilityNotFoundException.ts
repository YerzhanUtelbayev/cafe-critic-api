import HttpExceptions from './HttpExceptions'

class FacilityNotFoundException extends HttpExceptions {
  constructor (id: string) {
    super(404, `Place with id ${id} not found`)
  }
}

export default FacilityNotFoundException
