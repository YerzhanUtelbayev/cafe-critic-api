import 'dotenv/config'
import validateEnv from './utilities/validateEnv'

import App from './app'
import AuthenticationController from './controllers/authentication/authentication.controller'
import FacilityController from './controllers/facility/facility.controller'
import ImagesController from './controllers/image/image.controller'
import ReviewsController from './controllers/review/review.controller'

validateEnv()

const app = new App(
  [
    new AuthenticationController(),
    new FacilityController(),
    new ImagesController(),
    new ReviewsController()
  ],
  process.env.port || 8000
)

app.listen()
