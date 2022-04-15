'use strict'

const {
  app,
  ipcMain,
  BrowserWindow
} = require('electron')

const path = require('path')

const ct = {
  tools: {},
  wins: {},
}

ct.util = require('./js/util')

function createWindow() {
  let win = new BrowserWindow({
    width: 900,
    height: 620,
    frame: false,
    // 开启这个选项的话，powertoys的fencyZones会无效。
    // transparent: true,
    webPreferences: {
      // 允许在渲染进程中使用nodejs
      nodeIntegration: true,
      webviewTag: true,
      // preload:path.join(__dirname, 'preload.js')
    },
  })
  win.loadFile('./view/index.html')
  // win.loadURL('https://www.baidu.com')
  // 打开开发者工具
  // win.webContents.openDevTools()
  return win
}

let openTool = function (param) {}

ipcMain.on('get_tool_key', (event, tool_config) => {
  let tool_key = ct.util.make_tool_key(tool_config)
  event.returnValue = tool_key
})

/**
 * 创建工具的窗口
 * @param {Object} tool_config tool_config.json
 * @returns 
 */
let createToolWindow = function (tool_config) {
  let tool_key = ct.util.make_tool_key(tool_config)

  // 如果工具已经打开，就直接显示工具，而不是重复打开
  if (ct.tools.hasOwnProperty(tool_key)) {
    ct.wins[tool_key].show()
    return
  }

  // 创建浏览器窗口
  let tool_win = new BrowserWindow(tool_config.window_option)
  tool_win.loadFile(tool_config.src)
  tool_win.on('close', (ev) => {
    if (ct.tools.hasOwnProperty(tool_key)) {
      ct.tools[tool_key].destroyed(ct)
    }
    delete ct.tools[tool_key]
    delete ct.wins[tool_key]
  })
  ct.wins[tool_key] = tool_win

  // 载入函数、事件等
  let mainjs = path.join(tool_config.path, tool_config.main)
  // 删除缓存(json文件的缓存)
  delete require.cache[mainjs]
  ct.tools[tool_key] = require(mainjs)

  ct.tools[tool_key].init(ct)
}


app.on('ready', () => {
  ct.wins.main_win = createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


ipcMain.on('new_tool_window', (event, tool_config) => {
  createToolWindow(tool_config)
  event.returnValue = '已打开窗口'
})
ipcMain.on('app_command', (event, command, args) => {
  let win = ct.wins.main_win
  switch (command) {
    case 'set_size':
      win.setSize(args.width, args.height)
      event.returnValue = '已设置尺寸'
      break
    case 'window_minimize':
      win.minimize()
      event.returnValue = '最小化'
      break
    case 'window_maximize':
      if (win.isMaximized()) {
        win.unmaximize()
        event.returnValue = '取消最大化'
      } else {
        win.maximize()
        event.returnValue = '最大化'
      }
      break
    case 'window_always_on_top':
      if (win.isAlwaysOnTop()) {
        win.setAlwaysOnTop(false)
        event.returnValue = false
      } else {
        win.setAlwaysOnTop(true)
        event.returnValue = true
      }
      break
    case 'app_close':
      //exit()直接关闭客户端，不会执行quit()
      app.exit()
      break
    case 'app_relaunch':
      app.relaunch()
      app.exit(0)
      break
    case 'open_dev_tools':
      win.webContents.openDevTools()
      event.returnValue = true
      break
    case 'window_show':
      win.show()
      event.returnValue = true
      break
    default:
      break
  }

})