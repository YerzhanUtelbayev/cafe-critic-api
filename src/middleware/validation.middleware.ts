import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { RequestHandler } from 'express'

import HttpException from '../exceptions/HttpExceptions'

function validationMiddleware<T> (
  type: any,
  skipMissingProperties = false
): RequestHandler {
  return (request, response, next) => {
    validate(plainToClass(type, request.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const messages = errors.filter(
            ({ constraints }) =>
              constraints && Object.keys(constraints).length > 0
          )
          const message = messages.join(', ')
          next(new HttpException(400, message))
        } else {
          next()
        }
      }
    )
  }
}

export default validationMiddleware
