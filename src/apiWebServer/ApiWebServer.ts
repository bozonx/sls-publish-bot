import _ from 'lodash';
import express from 'express'
import App from '../App.js';
import {ZEN_DATA_TMPL} from './zenDataTmpl.js';


type ZenDataHandler = () => Promise<Record<string, any>>


export class ApiWebServer {
  private readonly app: App
  private zenDataHandler?: ZenDataHandler


  constructor(app: App) {
    this.app = app
  }


  async init() {
    const app = express()

    app.get('/zendata', async (req, res) => {
      res.header('Content-Type', 'text/html')

      let data: Record<string, any> = {}

      if (this.zenDataHandler) {
        data = await this.zenDataHandler()
      }

      const html = _.template(ZEN_DATA_TMPL)({DATA: data})

      res.send(html)
    })

    // app.get('/zendata', async (req, res) => {
    //   res.header('Content-Type', 'application/json')
    //
    //   let data: Record<string, any> | null = null
    //
    //   if (this.zenDataHandler) {
    //     data = await this.zenDataHandler()
    //   }
    //
    //   res.send(JSON.stringify(data))
    // })

    // TODO: host 0.0.0.0
    // TODO: порт взять из конфига
    app.listen(3001)
  }


  setZenDataHandler(handler: ZenDataHandler) {
    this.zenDataHandler = handler
  }

}
