const {
  ipcRenderer
} = require('electron')


let already_write = false
let interval = setInterval(() => {
  let tx = document.querySelector('#textarea')
  if (tx != undefined) {

    if (!already_write) {
      document.querySelector('#textarea').value = '城墨写作插件测试。'
      already_write = true

      setTimeout(() => {
        let play = document.querySelector('.play')
        if (play != undefined) {
          play.click()
          clearInterval(interval)
        }
      }, 1000);
    }
  }

}, 300);

// window.onload = function () {}
window.test = function () {
  // ipcRenderer.send('webview_func', param)
  // ipcRenderer.sendToHost('from_webview', 'test_02')
  document.querySelector('#textarea').value = 'textarea'
  // let param = {
  //   type: 'get',
  //   item: 'editor_content'
  // }
  // let result = ipcRenderer.sendSync('webview_func', param)
  // console.log(result);
}