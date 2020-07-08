import { cleanEnv, str, port } from 'envalid'

function validateEnv ():void {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    MONGO_USER: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    PORT: port()
  })
}

export default validateEnv
