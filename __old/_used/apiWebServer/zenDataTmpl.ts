export const ZEN_DATA_TMPL = `<!DOCTYPE html>
<html lang="ru">
<head>
  <script>
    function copyElementToClipboard(elementId) {
      window.getSelection().removeAllRanges()
      let range = document.createRange()
      range.selectNode(document.getElementById(elementId))
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
  <hr />
  <div id="header-block">\${DATA.title}</div>
  <hr />
  <div id="img-url-block">\${DATA.mainImgUrl}</div>
  <hr />
  <div id="content-block">\${DATA.content}</div>
</body>
</html>`
