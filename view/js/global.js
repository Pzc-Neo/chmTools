const fs = require('fs')
const path = require('path')

const {
    clipboard,
    ipcRenderer
} = require('electron')

const ct = {}

/**
 * 用来存放打开的工具对象。
 * 工具的变量、函数什么的都存放在这儿。
 */
ct.tools = {}