import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'

import Controller from './interfaces/controller.interface'

class App {
  private readonly app: express.Application;
  private readonly port: string | number;
  private controllers: Controller[];

  constructor (controllers: Controller[], port: string | number) {
    this.app = express()
    this.port = port
    this.controllers = controllers
  }

  private mountMiddleware (): void {
    this.app.use(bodyParser.json({ limit: '50mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    this.app.use(
      '/uploads',
      express.static(path.join(__dirname, '../public/uploads'))
    )
  }

  private mountControllers (): void {
    this.controllers.forEach((controller) => {
      this.app.use('/', controller.router)
    })
  }

  public listen (): void {
    this.app.listen(this.port, () => {
      console.log(`Server started at port ${this.port}`)
    })
  }
}

export default App
