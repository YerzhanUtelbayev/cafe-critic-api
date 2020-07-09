import HttpExceptions from './HttpExceptions'

class ReviewNotFoundException extends HttpExceptions {
  constructor (id: string) {
    super(404, `Review with id ${id} not found`)
  }
}

export default ReviewNotFoundException
