(function (ct) {
  let configs = require('./tool.config.json')
  let tool_key = require('electron').ipcRenderer.sendSync('get_tool_key', configs)

  ct.tools[tool_key] = {
    // 必须有(就算是空的也得有)
    init: function () {
      return new Vue({
        el: `.winbox .${tool_key}`,
        data: {
          msg:'Hello World',
          btn: '按钮',

        },
        mounted() {},
        methods: {

        }
      })
    },
  }

})(ct)