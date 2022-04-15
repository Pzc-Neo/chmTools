(function (ct) {
  'use strict'

  let configs = require('./tool.config.json')

  let tool_key = require('electron').ipcRenderer.sendSync('get_tool_key', configs)

  ct.tools[tool_key] = {
    data: {
      synth: window.speechSynthesis,
      utterance: new SpeechSynthesisUtterance(),
      voice_list: []

    },
    // 必须有(就算是空的也得有)
    init: function () {

      ct.tools[tool_key].get_support_voices()

      document.querySelector(`.winbox .${tool_key} .speak`).addEventListener('click', function (ev) {
        ct.tools[tool_key].handle_speak()
      })

      document.querySelector(`.winbox .${tool_key} .speak_editor_seleted`).addEventListener('click', function (ev) {
        ct.tools[tool_key].handle_speak('editor_seleted')
      })

      document.querySelector(`.winbox .${tool_key} .speak_clipboard`).addEventListener('click', function (ev) {
        ct.tools[tool_key].handle_speak('clipboard')
      })

      document.querySelector(`.winbox .${tool_key} .pause`).addEventListener('click', function (ev) {
        ct.tools[tool_key].handle_pause()
      })

      document.querySelector(`.winbox .${tool_key} .resume`).addEventListener('click', function (ev) {
        ct.tools[tool_key].handle_resume()
      })

      document.querySelector(`.winbox .${tool_key} .stop`).addEventListener('click', function (ev) {
        ct.tools[tool_key].handle_stop()
      })

      document.querySelector(`.winbox .${tool_key} .volume`).addEventListener('change', function (ev) {
        document.querySelector(`.winbox .${tool_key} .show_volume_value`).innerText = ev.target.value
      })

      document.querySelector(`.winbox .${tool_key} .rate`).addEventListener('change', function (ev) {
        document.querySelector(`.winbox .${tool_key} .show_rate_value`).innerText = ev.target.value
        ct.tools[tool_key].data.utterance.rate = ev.target.value
      })

      document.querySelector(`.winbox .${tool_key} .pitch`).addEventListener('change', function (ev) {
        document.querySelector(`.winbox .${tool_key} .show_pitch_value`).innerText = ev.target.value
      })

    },
    /**
     * 获取支持的语音库(即发音人)
     */
    get_support_voices: function () {
      let voices = this.data.synth.getVoices()
      this.data.voice_list = voices

      voices.forEach((voice, index) => {
        const option = document.createElement('option')
        option.value = index
        option.text = voice.name
        document.querySelector(`.winbox .${tool_key} .voices`).appendChild(option)
      })
    },
    handle_speak: function (type) {
      if (type == 'clipboard') {
        this.data.utterance.text = clipboard.readText()
      } else if (type == 'editor_seleted') {
        // let selected = ct.view.current_editor.editor.getSelection()
        let selected = window.getSelection().toString()
        this.data.utterance.text = selected
      } else {
        this.data.utterance.text = ct.view.current_editor.editor.getValue()
      }

      this.data.utterance.rate = document.querySelector(`.winbox .${tool_key} .rate`).value
      this.data.utterance.volume = document.querySelector(`.winbox .${tool_key} .volume`).value

      this.data.utterance.pitch = document.querySelector(`.winbox .${tool_key} .pitch`).value

      let index = document.querySelector(`.winbox .${tool_key} .voices`).value
      this.data.utterance.voice = this.data.voice_list[index]
      this.data.synth.speak(this.data.utterance)

      this.data.utterance.onpause = function (event) {
        // console.log(event);
        // this.data.utterance.rate = parseInt(document.querySelector(`.winbox .${tool_key} .rate`).value)
      }
    },
    handle_stop: function (e) {
      this.data.synth.cancel()
    },
    handle_pause: function (e) {
      this.data.synth.pause()
    },
    handle_resume: function (e) {
      this.data.synth.resume()
    },

    create_eles: function (name_list) {
      let parent = document.querySelector(`.winbox .${tool_key} .show_result`)

      parent.innerHTML = ''

      for (let index = 0; index < name_list.length; index++) {
        const name = name_list[index];
        let el = document.createElement('span')
        el.innerText = name
        el.title = name
        el.className = "chmST_label_title chmCL_label_title can_mark"
        el.style.margin = "2px"
        el.style.userSelect = "auto"
        el.onclick = function () {
          ct.editor.insert_string(this.title)
        }
        parent.appendChild(el)
      }
    }
  }

  // ct.tools.random_name.init()
})(ct)