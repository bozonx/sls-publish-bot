import _ from 'lodash';
import express from 'express'
import App from '../App.js';
import {ZEN_DATA_TMPL} from './zenDataTmpl.js';
import * as core from 'express-serve-static-core';
import http from 'http';


type ZenDataHandler = () => Promise<Record<string, any>>


export class ApiWebServer {
  private readonly app: App
  private zenDataHandler?: ZenDataHandler
  private readonly express: core.Express
  private mainServer?: http.Server


  constructor(app: App) {
    this.app = app
    this.express = express()
  }


  async init() {
    this.express.get('/zendata', async (req, res) => {
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

    this.mainServer = this.express.listen(this.app.appConfig.webServerPost, this.app.appConfig.hostname)
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
