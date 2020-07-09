import HttpExceptions from './HttpExceptions'

class PlaceQueryMissingException extends HttpExceptions {
  constructor () {
    super(400, 'Query parameter \'place\' containing id should be provided')
  }
}

export default PlaceQueryMissingException
