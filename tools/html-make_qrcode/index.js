(function (ct) {
  let configs = require('./tool.config.json')

  let tool_key = require('electron').ipcRenderer.sendSync('get_tool_key', configs)

  // let tool_key = `.winbox .${tool_key} `

  ct.tools[tool_key] = {
    data: {},
    // 必须有(就算是空的也得有)
    init: function () {

      ct.tools[tool_key].make_qrcode(`.${tool_key} .canvas`)

      document.querySelector(`.${tool_key} .generate`).addEventListener('click', function () {
        ct.tools[tool_key].make_qrcode(`.${tool_key} .canvas`)
      })
      // document.querySelector(`.${tool_key} .screen_shot`).addEventListener('click', function () {
      //   // ct.tools[tool_key].make_qrcode(`.${tool_key} .canvas`)
      // ct.util.screen_shot()
      // })

    },
    make_qrcode: function (canvas_selector) {
      let text = document.querySelector(`.${tool_key} .qrcode_text`).value
      ct.util.make_qrcode(canvas_selector, text)
    },

  }

  // ct.tools.random_name.init()
})(ct)