import { Request, Response, NextFunction } from 'express'

import HttpExceptions from '../exceptions/HttpExceptions'

function errorMiddleware (
  error: HttpExceptions,
  request: Request,
  response: Response,
  _next: NextFunction
):Response {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'
  console.log(error)
  return response.status(status).send({ message, status })
}

export default errorMiddleware
