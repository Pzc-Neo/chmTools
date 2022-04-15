const {
  ipcRenderer
} = require('electron')



window.test = function () {
  // ipcRenderer.send('webview_func', param)
  // ipcRenderer.sendToHost('from_webview', 'test_02')
  let param = {
    type: 'get',
    item: 'editor_content'
  }
  let result = ipcRenderer.sendSync('webview_func', param)
  console.log(result);
}