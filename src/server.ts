import 'dotenv/config'
import validateEnv from './utilities/validateEnv'

import App from './app'
import AuthenticationController from './controllers/authentication/authentication.controller'
import FacilityController from './controllers/facility/facility.controller'

validateEnv()

const app = new App(
  [new AuthenticationController(), new FacilityController()],
  process.env.port || 8000
)

app.listen()
