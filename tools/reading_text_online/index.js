(function (ct) {
  let configs = require('./tool.config.json')

    let tool_key = require('electron').ipcRenderer.sendSync('get_tool_key', configs)

  ct.tools[tool_key] = {
    data: {
      last_name: {
        // 单姓
        single_list: ['钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '水', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '鲍', '史', '唐', '费', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '成', '戴', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '粱', '杜', '阮', '席', '季', '麻', '强', '贾', '路', '娄', '危', '江', '童', '颜', '郭', '梅', '盛', '林', '刁', '钟', '徐', '邱', '骆', '高', '夏', '蔡', '田', '胡', '凌', '霍', '万', '柯', '卢', '莫', '房', '缪', '干', '解', '应', '宗', '丁', '宣', '邓', '郁', '单', '杭', '洪', '包', '诸', '左', '石', '崔', '吉', '龚', '程', '邢', '滑', '裴', '陆', '荣', '翁', '荀', '羊', '甄', '家', '封', '芮', '储', '靳', '邴', '松', '井', '富', '乌', '焦', '巴', '弓', '牧', '隗', '山', '谷', '车', '侯', '伊', '宁', '仇', '祖', '武', '符', '刘', '景', '詹', '束', '龙', '叶', '幸', '司', '韶', '黎', '乔', '苍', '双', '闻', '莘', '劳', '逄', '姬', '冉', '宰', '桂', '牛', '寿', '通', '边', '燕', '冀', '尚', '农', '温', '庄', '晏', '瞿', '茹', '习', '鱼', '容', '向', '古', '戈', '终', '居', '衡', '步', '都', '耿', '满', '弘', '国', '文', '东', '殴', '沃', '曾', '关', '红', '游', '盖', '益', '桓', '公', '晋', '楚', '闫'],
        // 复姓
        compound_list: ['欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫', '万俟', '闻人', '夏侯', '诸葛', '尉迟', '公羊', '赫连', '澹台', '皇甫', '宗政', '濮阳', '公冶', '太叔', '申屠', '公孙', '慕容', '仲孙', '钟离', '长孙', '宇文', '司徒', '鲜于', '司空', '闾丘', '子车', '亓官', '司寇', '巫马', '公西', '颛孙', '壤驷', '公良', '漆雕', '乐正', '宰父', '谷梁', '拓跋', '夹谷', '轩辕', '令狐', '段干', '百里', '呼延', '东郭', '南门', '羊舌', '微生', '公户', '公玉', '公仪', '梁丘', '公仲', '公上', '公门', '公山', '公坚', '左丘', '公伯', '西门', '公祖', '第五', '公乘', '贯丘', '公皙', '南荣', '东里', '东宫', '仲长', '子书', '子桑', '即墨', '达奚', '褚师']
      },
      first_name: {
        girl_list: ['秀', '娟', '英', '华', '慧', '巧', '美', '娜', '静', '淑', '惠', '珠', '翠', '雅', '芝', '玉', '萍', '红', '娥', '玲', '芬', '芳', '燕', '彩', '春', '菊', '兰', '凤', '洁', '梅', '琳', '素', '云', '莲', '真', '环', '雪', '荣', '爱', '妹', '霞', '香', '月', '莺', '媛', '艳', '瑞', '凡', '佳', '嘉', '琼', '勤', '珍', '贞', '莉', '桂', '娣', '叶', '璧', '璐', '娅', '琦', '晶', '妍', '茜', '秋', '珊', '莎', '锦', '黛', '青', '倩', '婷', '姣', '婉', '娴', '瑾', '颖', '露', '瑶', '怡', '婵', '雁', '蓓', '纨', '仪', '荷', '丹', '蓉', '眉', '君', '琴', '蕊', '薇', '菁', '梦', '岚', '苑', '婕', '馨', '瑗', '琰', '韵', '融', '园', '艺', '咏', '卿', '聪', '澜', '纯', '毓', '悦', '昭', '冰', '爽', '琬', '茗', '羽', '希', '宁', '欣', '飘', '育', '滢', '馥', '筠', '柔', '竹', '霭', '凝', '晓', '欢', '霄', '枫', '芸', '菲', '寒', '伊', '亚', '宜', '可', '姬', '舒', '影', '荔', '枝', '思', '丽'],
        boy_list: ['伟', '刚', '勇', '毅', '俊', '峰', '强', '军', '平', '保', '东', '文', '辉', '力', '明', '永', '健', '世', '广', '志', '义', '兴', '良', '海', '山', '仁', '波', '宁', '贵', '福', '生', '龙', '元', '全', '国', '胜', '学', '祥', '才', '发', '武', '新', '利', '清', '飞', '彬', '富', '顺', '信', '子', '杰', '涛', '昌', '成', '康', '星', '光', '天', '达', '安', '岩', '中', '茂', '进', '林', '有', '坚', '和', '彪', '博', '诚', '先', '敬', '震', '振', '壮', '会', '思', '群', '豪', '心', '邦', '承', '乐', '绍', '功', '松', '善', '厚', '庆', '磊', '民', '友', '裕', '河', '哲', '江', '超', '浩', '亮', '政', '谦', '亨', '奇', '固', '之', '轮', '翰', '朗', '伯', '宏', '言', '若', '鸣', '朋', '斌', '梁', '栋', '维', '启', '克', '伦', '翔', '旭', '鹏', '泽', '晨', '辰', '士', '以', '建', '家', '致', '树', '炎', '德', '行', '时', '泰', '盛', '雄', '琛', '钧', '冠', '策', '腾', '楠', '榕', '风', '航', '弘'],
      },

      // 随机姓名设置元素所绑定的值
      property: {
        first_name: "",
        is_random_surname: true,
        compound_surname: 0,
        is_gril: 0,
        quantity: 10,
      },
    },
    // 必须有(就算是空的也得有)
    init: function () {

      let results = ct.tools[tool_key].get()
      ct.tools[tool_key].create_eles(results)


      document.querySelector(`#${tool_key} .generate`).addEventListener('click', function () {
        let results = ct.tools[tool_key].get()
        ct.tools[tool_key].create_eles(results)
      })

      document.querySelector(`#${tool_key} .insert`).addEventListener('click', function () {
        let results = ct.tools[tool_key].get()
        ct.editor.insert_string(results[0])
      })
    },
    random_choice: function (list, num) {
      let result_list = []
      while (num > 0) {
        let index = Math.floor((Math.random() * list.length));
        result_list.push(list[index])
        num--
      }
      return result_list
    },

    /**
     * 获取随机姓名
     * @param {string} p_last_name 姓
     * @param {string} is_compound_surname 是不是单姓
     * @param {number} is_gril 是否生成女名(默认为男)
     * @param {number} num 数量
     * @returns 姓名列表
     */
    random_name: function (p_last_name, is_compound_surname, is_gril, num) {

      let result_list = []
      while (num > 0) {
        // 姓
        let last_name = p_last_name
        if (last_name == "") {
          if (is_compound_surname) {
            last_name = this.random_choice(this.data.last_name.compound_list, 1)
          } else {
            last_name = this.random_choice(this.data.last_name.single_list, 1)
          }
        }

        // 名
        let first_name = ''
        if (is_gril) {
          first_name = this.random_choice(this.data.first_name.girl_list, 2).join('')
        } else {
          first_name = this.random_choice(this.data.first_name.boy_list, 2).join('')
        }
        result_list.push(last_name + first_name)
        num--
      }
      return result_list
    },
    get: function () {
      let last_name = document.querySelector(`#${tool_key} .last_name`).value || ''
      let is_compound_surname = document.querySelector(`#${tool_key} .compound_surname`).checked
      let is_gril = document.querySelector(`#${tool_key} .is_gril`).checked
      let quantity = document.querySelector(`#${tool_key} .quantity`).value || 6

      let results = ct.tools[tool_key].random_name(last_name, is_compound_surname, is_gril, parseInt(quantity))
      return results
    },
    create_eles: function (name_list) {
      let parent = document.querySelector(`#${tool_key} .show_result`)

      parent.innerHTML = ''

      for (let index = 0; index < name_list.length; index++) {
        const name = name_list[index];
        let el = document.createElement('span')
        el.innerText = name
        el.className = "chmST_label_title chmCL_label_title"
        el.style.margin = "2px"
        el.onclick = function () {
          this.innerText
          ct.editor.insert_string(this.innerText)
        }
        parent.appendChild(el)
      }
    }
  }

  // ct.tools.random_name.init()
})(ct)