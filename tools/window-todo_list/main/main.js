;(function () {
  "use strict"

  const { ipcMain } = require("electron")
  const fs = require("fs")
  const path = require("path")

  module.exports = {
    data: {
      tool_key: "",
    },
    /**
     * 打开软件的时候执行(可以为空，但必须要有)
     * @param {Object} ct 主进程传递过来的
     */
    init: function (ct) {
      let tool_config = require("../tool.config.json")
      this.tool_config = tool_config
      this.data.tool_key = ct.util.make_tool_key(tool_config)
      let win = ct.wins[this.data.tool_key]

      ipcMain.on(this.data.tool_key, (event, arg) => {
        if (arg == "win_close") {
          this.save_config(win)
          win.close()
          event.returnValue = "已关闭窗口"
        } else if (arg == "win_minimize") {
          win.minimize()
          event.returnValue = "窗口最小化"
        } else if (arg == "win_always_on_top") {
          let is_top = win.isAlwaysOnTop()
          win.setAlwaysOnTop(!is_top)
          event.returnValue = !is_top
        } else if (arg == "win_maximize") {
          if (win.isMaximized()) {
            win.unmaximize()
            event.returnValue = "取消最大化"
          } else {
            win.maximize()
            event.returnValue = "最大化"
          }
        }
      })
    },

    // 关闭软件的时候执行(可以为空，但必须要有)
    destroyed: function () {
      // 移除本软件的所有监听器
      ipcMain.removeAllListeners(this.data.tool_key)
    },
    save_config: function (win) {
      let sizes = win.getSize()
      this.tool_config.window_option.width = sizes[0]
      this.tool_config.window_option.height = sizes[1]

      let pos = win.getPosition()
      this.tool_config.window_option.x = pos[0]
      this.tool_config.window_option.y = pos[1]

      let str = JSON.stringify(this.tool_config)
      let file_path = path.join(__dirname, "../tool.config.json")
      fs.writeFileSync(file_path, str)
    },
  }
})()
