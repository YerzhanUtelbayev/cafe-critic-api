import path from 'path'

import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import Controller from './interfaces/controller.interface'
import errorMiddleware from './middleware/error.middleware'

class App {
  private readonly app: express.Application;
  private readonly port: string | number;
  private controllers: Controller[];

  constructor (controllers: Controller[], port: string | number) {
    this.app = express()
    this.port = port
    this.controllers = controllers

    this.connectToTheDatabase()
    this.initializeMiddleware()
    this.initializeControllers()
    this.initializeErrorHandling()
  }

  private initializeMiddleware (): void {
    this.app.use(bodyParser.json({ limit: '50mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    this.app.use(cors())
    this.app.use(cookieParser())
    this.app.use(
      '/uploads',
      express.static(path.join(__dirname, '../public/uploads'))
    )
  }

  private initializeErrorHandling (): void {
    this.app.use(errorMiddleware)
  }

  private initializeControllers (): void {
    this.controllers.forEach((controller) => {
      this.app.use('/', controller.router)
    })
  }

  public listen (): void {
    this.app.listen(this.port, () => {
      console.log(`Server started at port ${this.port}`)
    })
  }

  public getServer (): express.Application {
    return this.app
  }

  private getDbPath (): string {
    return 'mongodb://localhost:27017/cafedb'
  }

  private connectToTheDatabase (): void {
    mongoose
      .connect(this.getDbPath(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      })
      .then(() => console.log('Mongoose connected'))
      .catch(console.log)
  }
}

export default App
