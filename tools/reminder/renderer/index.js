const { ipcRenderer } = require('electron')

let configs = require('../tool.config.json')
let tool_key = require('electron').ipcRenderer.sendSync('get_tool_key', configs)

let app = new Vue({
  el: '#app',
  data: {
    app_name: '定时提醒器 v' + configs.version,
    // 输入框数值(单位：分钟)
    minute: 60,
    remaining_time: '00:00:00',
    // 剩余秒数
    remaining_second: 3600,
    time_list: [10, 25, 35, 45],
    // 是否
    is_running: false,
    is_pause: false,
    // 计时器
    interval: '',
    is_show_time_is_up: false,
    win_always_on_top: false,
  },
  methods: {
    start: function (minute) {
      // 如果已经开始倒计时，就先停止
      if (this.interval != '') {
        this.stop()
      }

      if (minute != undefined) {
        this.minute = minute
      }

      if (Number.isNaN(this.minute * 1)) {
        alert('你输入的不是数字，请重新输入')
        // this.minute = 0
        return
      }

      // 如果包含 + - * / 的话就执行计算，并保留两位小数
      if (this.minute.toString().match(/[\+\-\*\/]/)) {
        this.minute = eval(this.minute).toFixed(2)
      }

      this.remaining_second = this.minute * 60

      this.is_running = true

      let that = this
      this.interval = setInterval(() => {
        if (!that.is_pause) {
          if (that.remaining_second <= 0) {
            that.time_is_up()
          }
          that.remaining_time = that.time_formater(that.remaining_second)
          that.remaining_second--
        }
      }, 1000)
    },
    pause: function () {
      this.is_pause = !this.is_pause
    },
    stop: function () {
      clearInterval(this.interval)
      this.is_running = false
      this.is_pause = false
      this.remaining_time = '00:00:00'
      const audio = document.querySelector('.clock_sound')
      audio.pause()
      audio.currentTime = 0
    },
    time_is_up: function () {
      clearInterval(this.interval)
      this.is_running = false

      const audio = document.querySelector('.clock_sound')
      audio.play()
      setTimeout(() => {
        // 重新载入音频(播放进度清零)
        audio.pause()
        audio.currentTime = 0
      }, 30 * 1000)

      this.is_show_time_is_up = true

      this.app_command('win_show')
      // 要加上下面这几行代码才能保证，时间到了的时候，窗口弹出来(全屏看视频的时候，还是不会弹出来的)
      this.app_command('win_always_on_top')
      setTimeout(() => {
        this.app_command('win_always_on_top')
      }, 1500)
    },
    close_time_is_up_panel: function () {
      this.is_show_time_is_up = false
      const audio = document.querySelector('.clock_sound')
      audio.pause()
      audio.currentTime = 0
    },

    time_formater: function (p_second) {
      let seconds = new Date(p_second)
      let min = Math.floor(seconds % 3600)

      let h = Math.floor(seconds / 3600)
      let m = Math.floor(min / 60)
      let s = seconds % 60
      let resulte = `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${
        s < 10 ? '0' : ''
      }${s}`
      return resulte
    },
    win_close: function () {
      ipcRenderer.sendSync(tool_key, 'win_close')
    },
    app_command: function (command) {
      let result = ipcRenderer.sendSync(tool_key, command)
      if (command == 'win_always_on_top') {
        this.win_always_on_top = result
      }
    },
  },
})
