(function (ct) {
  let configs = require('./tool.config.json')

  let tool_key = require('electron').ipcRenderer.sendSync('get_tool_key', configs)

  ct.tools[tool_key] = {
    lib: {
      jieba: require('./node_modules/nodejieba'),
      jschardet: require('./node_modules/jschardet'),
      encoding: require('./node_modules/encoding'),
    },
    data: {
      // 当前的词典数组
      current_word_dict: undefined,
      // 当前词典路径
      current_word_dict_path: './word_dicts/default_word_dict.json',
      // 当前词典名称
      current_use_dict: "默认",
      // 词典列表
      dict_list: [],
      // 结果列表
      result_list: [],
    },
    init: function () {

      // 获取词典列表 并显示在select标签里面
      ct.tools[tool_key].get_dict_list()

      ct.tools[tool_key].get_and_show()

      // 随机生成词语
      document.querySelector(`.winbox .${tool_key} .random_word`).addEventListener('click', function () {
        ct.tools[tool_key].get_and_show()
      })

      document.querySelector(`.winbox .${tool_key} .focus_next`).addEventListener('click', function (ev) {
        ct.view.focus_next(ev)
      })

      document.querySelector(`.winbox .${tool_key} .generate_word_dict_from_file`).addEventListener('click', function () {
        let result = ipcRenderer.sendSync('get-message', 'get_file_path')
        if (!result.canceled) {
          let file_path = result.filePaths
          ct.tools[tool_key].generate_word_dict(file_path[0])
        }
      })

      // 插入到编辑器
      document.querySelector(`.winbox .${tool_key} .insert`).addEventListener('click', function () {
        let list = ct.tools[tool_key].data.result_list
        let temp_list = []

        for (let index = 0; index < list.length; index++) {
          const word = list[index];
          let temp = `${word.word} ${word.count} ${word.tag}`
          temp_list.push(temp)
        }
        let separator = document.querySelector(`.winbox .${tool_key} .separator`).value
        ct.editor.insert_string(temp_list.join(separator))
      })

      // 打开词典文件夹
      document.querySelector(`.winbox .${tool_key} .open_dict_folder`).addEventListener('click', function () {
        ct.util.open_folder(path.join(__dirname, './word_dicts'))
      })
    },
    /**
     * 统计词频
     * @param {Array} arr 词语列表
     * @returns 包含词频的词语列表
     */
    get_word_count: (arr) => {
      // obj = {"文字1"=5,"文字2":10}
      // 在这个阶段已经去重了
      var obj = {};
      for (var i = 0, l = arr.length; i < l; i++) {
        var item = arr[i];
        obj[item] = (obj[item] + 1) || 1;
      }

      // 转成数组
      // obj = [{word="文字1",count:5},{word:"文字2",count:10}]
      let word_count = []
      for (let key in obj) {
        // 只要长度>=2的词
        if (key.length >= 2) {
          let temp_obj = new Object()
          temp_obj.word = key
          temp_obj.count = obj[key]
          // temp_obj.tag = word_tag[key]
          word_count.push(temp_obj)
        }
      }

      // 按次数从大到小排序
      // word_count = word_count.sort((a, b) => {
      //   return b.count - a.count
      // })

      return word_count;
    },

    // 通过txt文件生成词典
    generate_word_dict: function (file_path) {

      let extname = path.extname(file_path)
      let file_name = path.basename(file_path, extname)
      // let file_name = path.
      fs.readFile(file_path, (err, text) => {
        // 获取编码
        let encoding_type = this.lib.jschardet.detect(text)

        // 转换成utf-8
        text = this.lib.encoding.convert(text, "utf-8", encoding_type.encoding).toString()

        // 用的时间比较长
        // 分词
        let source_word_list = this.lib.jieba.cut(text)

        // 用的时间比较长
        // 词性词典
        // let temp_word_tag = jieba.tag(text)
        // let word_tag = {}
        // for (let key in temp_word_tag) {
        //     word_tag[temp_word_tag[key].word] = temp_word_tag[key].tag
        // }

        // 统计字词次数
        // let word_count = data.get_word_count(source_word_list, word_tag)
        let word_count = this.get_word_count(source_word_list)

        console.log(__dirname);
        // 写到文件
        let save_path = path.join(__dirname, "/word_dicts/", file_name, '.json')
        // fs.writeFileSync(save_path, "exports.word_list = " + JSON.stringify(word_count))
        fs.writeFile(save_path, JSON.stringify(word_count), () => {
          this.choose_current_word_dict(save_path, file_name)
          alert("词典制作完成")
        })

      })
    },


    // 选择词典
    choose_current_word_dict: (dict_path, file_name) => {
      if (dict_path == 'default') {
        ct.tools[tool_key].current_word_dict = undefined
        ct.tools[tool_key].current_use_dict = fs.readFileSync(path.join(__dirname, '/word_dicts/default_word_dict_path.config')).toString().split(",")[0]

      } else {
        ct.tools[tool_key].current_word_dict = JSON.parse(fs.readFileSync(dict_path))
        ct.tools[tool_key].current_word_dict_path = dict_path
        ct.tools[tool_key].current_use_dict = file_name
      }
    },

    // 设为默认词典
    set_as_default_word_dict: () => {
      fs.writeFileSync(path.join(__dirname, '/word_dicts/default_word_dict_path.config'), ct.tools[tool_key].current_use_dict + "," + ct.tools[tool_key].current_word_dict_path)
      alert(ct.tools[tool_key].current_use_dict + ': 已设为默认')
    },

    /**
     * 随机选择词语
     * @param {number} quantity 数量
     * @param {number} min_count 词频
     * @returns 词语列表
     */
    random_choice_word: function (quantity, min_count) {
      let word_list = []

      let dict_path = document.querySelector(`.winbox .${tool_key} .select_dict`).value

      if (fs.existsSync(dict_path)) {
        word_list = require(dict_path)
      } else {
        // 默认词典
        word_list = require(path.join(__dirname, './word_dicts/default_word_dict.json'))
      }

      // 筛选词频大于min_count的 
      word_list = word_list.filter(word => {
        return word.count > min_count
      })

      // 筛选名词
      word_list = word_list.filter(word => {
        return word.tag = 'ns'
      })

      let result_list = []

      // 选择quantity个词语
      for (let i = 0; i < quantity; i++) {
        let temp = Math.floor(Math.random() * word_list.length)
        result_list.push(word_list[temp])
      }

      return result_list
    },
    get_and_show: function () {

      let quantity = document.querySelector(`.winbox .${tool_key} .quantity`).value
      let count = document.querySelector(`.winbox .${tool_key} .count`).value
      quantity = parseInt(quantity) || 6
      count = parseInt(count) || 50

      let results = ct.tools[tool_key].random_choice_word(quantity, count)
      ct.tools[tool_key].data.result_list = results
      ct.tools[tool_key].create_eles(results)
    },
    /**
     * 通过词语列表创建html元素
     * @param {Array} word_list 词语列表
     */
    create_eles: function (word_list) {
      let parent = document.querySelector(`.winbox .${tool_key} .show_result`)

      parent.innerHTML = ''

      for (let index = 0; index < word_list.length; index++) {
        const word = word_list[index];
        let el = document.createElement('button')
        // let text = 
        el.innerText = word.word + ' ' + word.count + ' ' + word.tag
        el.title = word.word + ' (' + word.count + ") "
        el.className = "chmST_label_title chmCL_label_title can_mark"
        el.style.margin = "2px"
        el.style.userSelect = "auto"
        el.onclick = function () {

          let separator = document.querySelector(`.winbox .${tool_key} .separator`).value
          ct.editor.insert_string(this.title + separator)
        }
        parent.appendChild(el)
      }
    },
    /**
     * 获取词典列表
     */
    get_dict_list: function () {
      let that = this

      let word_dict_path = path.join(__dirname, '/word_dicts')

      fs.readdir(word_dict_path, {
        encoding: 'utf-8'
      }, (err, files) => {
        if (err) {
          ct.debug.show_err('get_dict_list', err)
        } else {
          that.data.dict_list = []
          for (let index = 0; index < files.length; index++) {
            const file = files[index];
            let exname = path.extname(file)
            let name = path.basename(file, exname)
            let temp = {
              name: name,
              path: path.join(word_dict_path, file)
            }
            that.data.dict_list.push(temp)
          }
          that.create_eles_option(`.${tool_key} .select_dict`, that.data.dict_list)
        }
      })
    },
    /**
     * 根据列表创建<option>元素
     * @param {string} selecter 父级元素选择器
     * @param {string} option_list 选项列表
     */
    create_eles_option: function (selecter, option_list) {
      let parent = document.querySelector(selecter)
      if (parent != undefined) {
        for (let index = 0; index < option_list.length; index++) {
          const option = option_list[index];
          let el = document.createElement('option')
          el.value = option.path
          el.innerText = option.name
          document.querySelector(selecter).appendChild(el)
        }
      } else {
        ct.debug.show_err('父级元素不存在或选择器错误')
      }
    },
    insert_to_editor: function (param) {
      document.querySelector(`.winbox .${tool_key} .insert`).addEventListener('click', function () {
        let results = ct.tools[tool_key].get()
        ct.editor.insert_string(results[0])
      })
    }
  }
})(ct)