import express from 'express'
import App from '../App.js';


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

      const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<script>
function copyElementToClipboard(elementId) {
  window.getSelection().removeAllRanges()
  let range = document.createRange()
  range.selectNode(document.getElementById(element))
  window.getSelection().addRange(range)
  document.execCommand('copy')
  window.getSelection().removeAllRanges()
}
</script>
</head>
<body>
<button onclick="copyElementToClipboard('header-block')">copy header</button>
<button onclick="copyElementToClipboard('img-url-block')">copy image url</button>
<button onclick="copyElementToClipboard('content-block')">copy content</button>
<p>header:</p>
<p id="header-block">${data.title}</p>
<p>img url:</p>
<p id="img-url-block">${data.mainImgUrl}</p>
<p>content:</p>
<p id="content-block">${data.content}</p>
</body>
</html>`

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
