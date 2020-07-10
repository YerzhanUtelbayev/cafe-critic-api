import { Request, Response } from 'express'

import HttpExceptions from '../exceptions/HttpExceptions'

function errorMiddleware (
  error: HttpExceptions,
  request: Request,
  response: Response
):Response {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'
  return response.status(status).send({ message, status })
}

export default errorMiddleware
