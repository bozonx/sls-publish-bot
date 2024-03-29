import * as https from 'https';
import * as http from 'http';
import _ from 'lodash';
import express, {NextFunction} from 'express'
import App from '../App.js';
import {ZEN_DATA_TMPL} from './zenDataTmpl.js';
import * as core from 'express-serve-static-core';


type ZenDataHandler = () => Promise<Record<string, any>>


export class ApiWebServer {
  private readonly app: App
  private zenDataHandler?: ZenDataHandler
  private readonly expressApp: core.Express
  private mainServer?: https.Server | http.Server


  constructor(app: App) {
    this.app = app
    this.expressApp = express()

    this.expressApp.use((err: any, req: any, res: any, next: NextFunction) => {
      if (err) {
        console.error(err.stack)
        res.status(500).send('Something broke!')
        next(err)
      }
      else {
        next()
      }
    })
  }


  async init() {
    this.expressApp.get('/zendata', async (req, res) => {
      res.header('Content-Type', 'text/html')

      let data: Record<string, any> = {}

      if (this.zenDataHandler) {
        data = await this.zenDataHandler()
      }

      const html = _.template(ZEN_DATA_TMPL)({DATA: data})

      res.send(html)
    })

    this.mainServer = this.expressApp
      .listen(this.app.appConfig.webServerLocalPort, '0.0.0.0')
  }

  async destroy() {
    return new Promise((resolve, reject) => {
      if (!this.mainServer) return

      this.mainServer.close((err?: Error) => {
        if (err) reject(err)
        else resolve(undefined)
      })
    })
  }

  setZenDataHandler(handler: ZenDataHandler | undefined) {
    this.zenDataHandler = handler
  }

}


// app.get('/zendata', async (req, res) => {
//   res.header('Content-Type', 'application/json')
//   let data: Record<string, any> | null = null
//   if (this.zenDataHandler) {
//     data = await this.zenDataHandler()
//   }
//   res.send(JSON.stringify(data))
// })


// if (this.app.appConfig.isProduction) {
//   if (
//     !this.app.appConfig.sslPrivateKeyFilePath
//     || !this.app.appConfig.sslCertFilePath
//   ) {
//     throw new Error(`Can't find SSL certificate`)
//   }
//
//   const privateKey = fs.readFileSync(this.app.appConfig.sslPrivateKeyFilePath)
//   const certificate = fs.readFileSync(this.app.appConfig.sslCertFilePath)
//   const credentials = {key: privateKey, cert: certificate}
//
//   this.mainServer = https.createServer(credentials, this.expressApp);
// }
// else {
//   this.mainServer = http.createServer({}, this.expressApp)
// }
