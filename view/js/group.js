(function (ct) {
    "use strict"
    ct.group = {
        data: {
            // 要把分组渲染到的标签的选择器
            target_el: '.chmST_side_bar .item_list',

            // 分组文件路径
            path: path.join(__dirname, 'js/group.json'),
            current_group_id: 'default',
            groups: [],
        },
        init: function () {
            this.get_list()
            this.render_el()
        },
        get_list: function () {
            let text = fs.readFileSync(this.data.path)
            this.data.groups = JSON.parse(text)
            if (this.data.groups[0].id != 'default') {
                this.data.groups.unshift({
                    "id": "default",
                    "name": "默认"
                })
            }
            return this.data.groups
        },
        save_list: function () {
            let groups = this.data.groups
            let text = JSON.stringify(groups)
            fs.writeFileSync(this.data.path, text)
        },
        new: function () {
            let id = ct.util.random_str('tool_group_id', 6)
            let group = {
                id: id,
                name: '新分组'
            }
            this.data.groups.push(group)
            ct.tool.data.tools[id] = []
            this.save_list()

            this.render_el()

        },
        render_el: function (target) {
            if (target == undefined) {
                target = this.data.target_el
            }

            let target_el = document.querySelector(target)
            target_el.innerHTML = ""
            for (let index = 0; index < this.data.groups.length; index++) {
                const item = this.data.groups[index];

                let el = document.createElement('div')
                el.id = item.id
                if (index === 0) {
                    el.className = "chmST_list_item chmCL_list_item selected"
                } else {
                    el.className = "chmST_list_item chmCL_list_item"
                }

                el.innerText = item.name
                el.setAttribute('index', index)
                el.setAttribute('drap_type', 'group')
                el.setAttribute('drop_type', 'group')
                el.onclick = function (ev) {
                    ct.group.change_to(ev.target)
                }
                el.oncontextmenu = function (ev) {
                    ct.view.data.contextmenu_ev = ev
                    ct.view.show_contextmenu(ev, '.tool_group')
                }

                el.addEventListener('dragover', ev => {
                    ev.preventDefault()
                })

                el.setAttribute('draggable', "true")
                el.addEventListener('dragstart', ev => {
                    ct.group.handle_drap(ev)
                })

                el.addEventListener('drop', ev => {
                    ct.group.handle_drop(ev)
                })

                target_el.appendChild(el)
            }
        },
        handle_drap: function (ev) {
            var drap_type = ev.target.attributes.drap_type.nodeValue
            var drap_index = ev.target.attributes.index.nodeValue

            ev.dataTransfer.setData("drap_type", drap_type)
            ev.dataTransfer.setData("drap_index", drap_index)
        },
        handle_drop: function (ev) {
            var drap_type = ev.dataTransfer.getData("drap_type")
            var drop_type = ev.target.attributes.drop_type.nodeValue
            var drap_index = ev.dataTransfer.getData("drap_index")
            var drop_index = ev.target.attributes.index.nodeValue
            drap_index = parseInt(drap_index)
            drop_index = parseInt(drop_index)

            if (drap_type == 'tool' && drop_type == 'group') {
                let id = ct.group.data.groups[drop_index].id

                let tool = ct.tool.data.tools[ct.group.data.current_group_id].splice(drap_index, 1)[0]

                tool.target = id

                ct.tool.data.tools[id].push(tool)
                ct.tool.render_el()

                ct.tool.save_config(tool)

            } else if (drap_type == drop_type) {
                if (drap_index == 0 || drop_index == 0) {
                    return
                }
                let tool = ct.group.data.groups.splice(drap_index, 1)[0]
                ct.group.data.groups.splice(drop_index, 0, tool)

                ct.group.render_el()
                ct.group.save_list()
            }
        },
        /**
         * 切换到分组
         * @param {dom} el html dom
         */
        change_to: function (el) {
            ct.el.remove_class('.chmST_side_bar .item_list .chmST_list_item.selected', 'selected')
            ct.el.add_class([el], 'selected', true)
            this.data.current_group_id = el.id

            ct.tool.render_el()
        },
        delete: function () {
            let ev = ct.view.data.contextmenu_ev
            let index = ev.target.getAttribute('index')
            let is_confirm = window.confirm(`确定删除分组：${this.data.groups[index].name} (id: ${this.data.groups[index].id}) 吗？`)
            if (is_confirm) {
                if (this.data.groups[index].id == 'default') {
                    alert('默认分组不能删除。')
                } else {
                    this.data.groups.splice(index, 1)

                    this.render_el()
                    this.save_list()

                    // this.change_to(ev.target.previousSibling)

                    ct.tool.init()
                }
            }
        },
        rename: function () {
            let event = ct.view.data.contextmenu_ev
            // let id = 

            var element = event.target
            var oldhtml = element.innerHTML;
            //如果已经双击过，内容已经存在input，不做任何操作
            if (oldhtml.indexOf('type="text"') > 0) {
                return;
            }
            //创建新的input元素
            var newobj = document.createElement('input')
            //为新增元素添加类型
            newobj.type = 'text'

            newobj.style.width = "100%"
            newobj.style.height = "100%"
            newobj.style.position = "absolute"
            newobj.style.top = "0px"
            newobj.style.left = "0px"
            newobj.style.boxSizing = "border-box"

            newobj.style.outlineStyle = "none"
            newobj.className = "chmCL_rename_input_box"

            //为新增元素添加value值
            newobj.value = oldhtml.trim();
            // newobj.value = oldhtml
            newobj.id = "temp_rename_input"

            //设置该标签的子节点为空
            // element.innerHTML = '';
            //添加该标签的子节点，input对象
            element.appendChild(newobj);
            //设置选择文本的内容或设置光标位置（两个参数：start,end；start为开始位置，end为结束位置；如果开始位置和结束位置相同则就是光标位置）
            newobj.setSelectionRange(0, oldhtml.length);
            //设置获得光标
            newobj.focus();

            newobj.onkeyup = function (event) {
                if (event.key == "Enter") {
                    newobj.blur()
                    // 被全局的快捷键覆盖了，以后再解决
                } else if (event.key == "Escape") {
                    is_rename = false
                    newobj.blur()
                }
            }

            let is_rename = true
            //为新增元素添加光标离开事件
            newobj.onblur = function () {
                //当触发时判断新增元素值是否为空，为空则不修改，并返回原有值 
                if (this.value && this.value.trim() !== "" && is_rename && this.value.trim() != oldhtml.trim()) {

                    let index = element.getAttribute('index')
                    ct.group.data.groups[index].name = this.value.trim()
                    ct.group.render_el()
                    ct.group.save_list()

                    if (this != undefined) {
                        this.remove()
                    }
                } else {
                    if (this != undefined) {
                        this.remove()
                    }
                }
            }
        },

    }

})(ct)