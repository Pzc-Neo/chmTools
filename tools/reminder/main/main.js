(function () {
  "use strict";

  const {
    ipcMain
  } = require('electron')

  module.exports = {
    data: {
      tool_key: ''
    },
    /**
     * 打开软件的时候执行(可以为空，但必须要有)
     * @param {Object} ct 主进程传递过来的
     */
    init: function (ct) {
      let tool = require('../tool.config.json')
      this.data.tool_key = ct.util.make_tool_key(tool)
      let win = ct.wins[this.data.tool_key]

      // 添加监听器(可以为空，但必须要有)
      ipcMain.on(this.data.tool_key, (event, arg) => {
        if (arg == "save") {
          this.save_database(event)
        } else if (arg == "open") {
          this.open_database(event)
        } else if (arg == 'win_close') {
          win.close()
          event.returnValue = "已关闭窗口"
        } else if (arg == 'win_show') {
          win.show()
          event.returnValue = "显示窗口"
        } else if (arg == 'win_always_on_top') {
          let is_top = win.isAlwaysOnTop()
          win.setAlwaysOnTop(!is_top)
          event.returnValue = !is_top
        } else if (arg == 'win_minimize') {
          win.minimize()
          event.returnValue = "窗口最小化"
        } else if (arg == 'win_maximize') {
          if (win.isMaximized()) {
            win.unmaximize()
            event.returnValue = '取消最大化'
          } else {
            win.maximize()
            event.returnValue = '最大化'
          }
        }
      })
    },

    // 关闭软件的时候执行(可以为空，但必须要有)
    destroyed: function () {
      // 移除本软件的所有监听器
      ipcMain.removeAllListeners(this.data.tool_key)
    },

  }
})()