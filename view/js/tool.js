(function (ct) {
    "use strict";
    ct.tool = {
        data: {
            target_el: '.chmST_tool_bar .item_list',
            // target_el:".chmST_content.chmCL_content.thinking",
            home: path.join(__dirname, '../tools'),
            // 插件列表
            tools: {
                default: [],
            },
            winboxs: [],
        },
        init: async function () {
            let groups = ct.group.get_list()
            let temp = {}
            groups.forEach(group => {
                temp[group.id] = []
            })
            this.data.tools = temp

            await this.get_list(this.data.home)

            this.render_el()
        },
        get_list: function (targe_path) {
            return new Promise((resolve, reject) => {

                fs.readdir(targe_path, function (err, dirs) {
                    if (err) {
                        ct.debug.show_err('get_list', err)
                        return
                    }
                    // 读取每个文件夹并加入列表
                    for (let i = 0; i < dirs.length; i++) {
                        let tool_folder_name = dirs[i];

                        let tool_path = path.join(ct.tool.data.home, tool_folder_name)

                        // 如果文件夹中包含`tool.json`就会被认定为是插件
                        if (fs.existsSync(path.join(tool_path, 'tool.config.json'))) {

                            let tool_config = ""
                            try {
                                // 删除缓存(js文件的缓存)
                                delete require.cache[path.join(tool_path, 'tool.config.json')];
                                tool_config = require(path.join(tool_path, 'tool.config.json'))
                            } catch (err) {
                                ct.debug.show_err('ct.tool.get_list', '插件目录：' + path.join(ct.tool.data.home, tool_folder_name) + '\n' + err);
                                // ct.debug.show_err('ct.tool.get_list','插件目录：' + path.join(ct.tool.data.home, tool_folder_name));
                                // ct.debug.show_err('\n插件加载出错\n' + err);
                                continue
                            }

                            tool_config.path = tool_path

                            tool_config.folder_name = tool_folder_name


                            if (!ct.tool.data.tools.hasOwnProperty(tool_config.target)) {
                                tool_config.target = 'default'
                            }
                            // 不存在于列表里面才添加到列表(通过插件的id判断)
                            let index = 0
                            ct.tool.data.tools[tool_config.target].forEach(tool => {
                                if (tool.id == tool_config.id && tool.version == tool_config.version) {
                                    ct.debug.show_err(`插件id重复，【${tool.name}】插件将不会被加载，详细信息：`, `${tool.path}`)
                                    index = 1
                                }
                            })
                            if (index == 0) {
                                ct.tool.data.tools[tool_config.target].push(tool_config)
                                // 是否自动打开
                                if (tool_config.style.auto_open || false) {
                                    ct.tool.open_tool(tool_config)
                                }
                            }
                        }
                    }
                    resolve('sussece')
                })
            });
        },
        render_el: function (target) {
            if (target == undefined) {
                target = this.data.target_el
            }

            let target_el = document.querySelector(target)

            let group_id = ct.group.data.current_group_id
            target_el.innerHTML = ""

            for (let index = 0; index < this.data.tools[group_id].length; index++) {
                const item = this.data.tools[group_id][index];

                if (item == undefined) {
                    continue
                }

                // let title = item.name + ' ' + item.version
                let title = item.name
                let author = '作者: ' + item.author
                let drag_info = `drap_type="tool" drop_type="tool" index=${index}`

                let icon_html = ''
                if (item.logo == '') {
                    icon_html = `<div class="no_icon" title="${item.id}">${item.id[0].toUpperCase()}</div>`
                } else {
                    let icon = path.join(item.path, item.logo)
                    icon_html = `<img src="${icon}"  ${drag_info}/>`
                }


                let html = `
                <div class="chmST_container_row" ${drag_info}>
                    <div class="icon" ${drag_info}>
                        ${icon_html}
                    </div>
                    <div class="content" ${drag_info}>
                        <div class="title" ${drag_info} title="${title}">${title}</div>
                        <div style="padding: 1px 0px; font-size: 0.85em;" ${drag_info} title="${author}">${author}</div>
                    </div>
                </div>
                <div style="flex:1;margin-top:8px;" ${drag_info} title=${item.description}>
                   <span class="chmST_tool_type chmCL_tool_type ${item.type}" ${drag_info}>
                   </span> v${item.version} ${item.description}
                </div>
                `

                let el = document.createElement('div')
                el.id = item.id
                el.setAttribute('index', index)

                el.setAttribute('drap_type', 'tool')
                el.setAttribute('drop_type', 'tool')

                el.setAttribute('draggable', "true")
                el.addEventListener('dragstart', ev => {
                    var drap_type = ev.target.attributes.drap_type.nodeValue
                    var drap_index = ev.target.attributes.index.nodeValue

                    ev.dataTransfer.setData("drap_type", drap_type)
                    ev.dataTransfer.setData("drap_index", drap_index)
                })

                el.className = "chmST_container_col item"
                el.innerHTML = html
                el.onclick = function (ev) {
                    let tools = ct.tool.data.tools[group_id]
                    ct.tool.open_tool(tools[ev.target.getAttribute('index')])
                }
                el.oncontextmenu = function (ev) {
                    ct.view.data.contextmenu_ev = ev
                    ct.view.show_contextmenu(ev, '.tool_item')
                }

                target_el.appendChild(el)
            }
        },
        menu_command: {
            show_tool_info: function () {
                let group_id = ct.group.data.current_group_id
                let tools = ct.tool.data.tools[group_id]
                let ev = ct.view.data.contextmenu_ev

                let tool = tools[ev.target.getAttribute('index')]

                let html = `
                <div class="chmCL_main" style="width: 100%; height: 100%;overflow:auto;">
                    <div class="one_row"><span class="chmST_label_title chmCL_label_title">ID</span><span class="chmST_label_title">${tool.id}</span></div>
                    <div class="one_row"><span class="chmST_label_title chmCL_label_title">名称</span><span class="chmST_label_title">${tool.name}</span></div>
                    <div class="one_row"><span class="chmST_label_title chmCL_label_title">描述</span><span class="chmST_label_title">${tool.description}</span></div>
                    <div class="one_row"><span class="chmST_label_title chmCL_label_title">版本</span><span class="chmST_label_title">${tool.version}</span></div>
                    <div class="one_row"><span class="chmST_label_title chmCL_label_title">作者</span><span class="chmST_label_title">${tool.author}</span></div>
                    <div class="one_row"><span class="chmST_label_title chmCL_label_title">图标</span><span class="chmST_label_title">${tool.logo}</span></div>
                    <div class="one_row"><span class="chmST_label_title chmCL_label_title">分组</span><span class="chmST_label_title">${tool.target}</span></div>
                    <div class="one_row"><span class="chmST_label_title chmCL_label_title">类型</span><span class="chmST_label_title">${tool.type}</span></div>
                </div>
                `
                let title = `【${tool.name}】的详细信息`
                new WinBox({
                    title: title,
                    html: html,
                    width: 290,
                    height: 250,
                    x: 'center',
                    y: 'center',
                    background: "#3478c1",
                });
            },
            open_folder: function () {
                let group_id = ct.group.data.current_group_id
                let tools = ct.tool.data.tools[group_id]
                let ev = ct.view.data.contextmenu_ev
                ct.util.open_folder(tools[ev.target.getAttribute('index')].path)
            },
        },
        open_tool: function (tool) {
            if (tool.type == "html") {
                this.open_tool_html(tool)
            } else if (tool.type == "webview") {
                this.open_tool_webview(tool)
            } else if (tool.type == "window") {
                this.open_tool_window(tool)
            } else if (tool.type == "url") {
                this.open_tool_url(tool)
            } else {
                alert(`插件 ${tool.name}(${tool.id}) 的type(${tool.type})不支持`)
            }
        },
        open_tool_html: function (tool) {
            let tool_key = ipcRenderer.sendSync('get_tool_key', tool)

            // 读入html
            let html = fs.readFileSync(path.join(tool.path, tool.html)).toString()

            // 读入css
            if (tool.hasOwnProperty('css')) {
                let css = fs.readFileSync(path.join(tool.path, tool.css)).toString()
                css = `<style>${css}</style>`
                html = css + html
            }

            // 把字符串`chmTools_tool_container`替换为tool_key
            html = html.replace(/chmTools_tool_container/g, tool_key)

            let winbox_id = 'winbox-' + tool_key

            let ele = document.getElementById(winbox_id)
            if (ele != undefined) {
                ct.tool.show(tool)
            } else {

                let pos = this.calc_position(tool)

                let winbox = new WinBox({
                    id: winbox_id,
                    title: `${tool.name} v${tool.version}`,
                    html: html,
                    // 样式
                    x: pos.x || "center",
                    y: pos.y || "center",
                    width: tool.style.width || "50%",
                    height: tool.style.height || "50%",
                    background: tool.style.background || "#1859a0",
                    border: tool.style.border || 3,

                    // 关闭本插件面板的同时，删除插件的函数
                    onclose: function () {
                        tool.style.x = this.x
                        tool.style.y = this.y
                        tool.style.width = this.width
                        tool.style.height = this.height
                        ct.tool.save_config(tool)

                        let tool_id = (this.id).replace('winbox-', '')
                        delete ct.tools[tool_id]
                    },
                    onfocus: function () {
                        this.setBackground(tool.style.background || "#1859a0");
                    },
                    onblur: function () {
                        this.setBackground(tool.style.background_blur || "#3d4756");
                    },
                    onmove: function (x, y) {
                        if (tool.style.show_position || false) {
                            this.setTitle(this.title.split('-')[0] +
                                " - x: " + x + ", " +
                                "y: " + y
                            );
                        }
                    },
                    onresize: function (width, height) {
                        if (tool.style.show_size || false) {
                            this.setTitle(this.title.split('-')[0] +
                                " - w: " + width + ", " +
                                "h: " + height
                            );
                        }
                    },
                });

                ct.tool.data.winboxs.push(winbox)
                document.getElementById(winbox.id).style.zIndex = 1000
                document.getElementById(winbox.id).style.borderRadius = tool.style.borderRadius || '5px'


                let js_path = path.join(tool.path, tool.js)

                // 删除缓存(js文件的缓存)
                delete require.cache[require.resolve(js_path)];
                // 加载插件函数
                require(js_path)

                // 初始化
                let try_time = 0
                let interval = setInterval(() => {
                    try {
                        ct.tools[tool_key].init()
                        clearInterval(interval)
                    } catch (err) {
                        if (try_time >= 9) {
                            clearInterval(interval)
                            ct.debug.show_err('open_tool_html', `插件【${ct.tools[tool.name]}】加载失败\n${err}`)
                        }
                        try_time += 1
                    }
                }, 100);
            }
        },
        open_tool_webview: function (tool) {

            let winbox_id = 'winbox-' + tool.id

            let src = path.join(tool.path, tool.html)
            let tool_div = document.createElement("webview")
            tool_div.id = tool.id
            tool_div.src = src
            tool_div.style.width = "100%"
            tool_div.style.height = "100%"

            console.log(tool);
            // tool_div.innerHTML = fs.readFileSync(path.join(tool.path, tool.main)).toString()

            // tool_div.preload = path.join(tool.path, tool.preload)
            tool_div.preload = path.join('file://', tool.path, tool.preload || '')

            // tool_div.preload =`file://${__dirname}/js/preload.js`
            document.querySelector('#tool_panel').appendChild(tool_div)

            let ele = document.getElementById(winbox_id)
            if (ele != undefined) {
                // alert('插件已打开')
                ct.tool.show(tool)
            } else {

                let pos = this.calc_position(tool)

                let winbox = new WinBox({
                    id: winbox_id,
                    // title: `${tool.name} V ${tool.version}`,
                    title: `${tool.name} v${tool.version}`,
                    mount: document.getElementById(tool_div.id),
                    // url: tool.url,
                    // 样式
                    x: pos.x || "center",
                    y: pos.y || "center",
                    width: tool.style.width || "50%",
                    height: tool.style.height || "50%",
                    background: tool.style.background || "#1859a0",
                    border: tool.style.border || 3,

                    // 关闭本插件面板的同时，删除插件的函数
                    onclose: function () {
                        let tool_id = (this.id).replace('winbox-', '')
                        delete ct.tools[tool_id]
                        // let el = document.getElementById(tool_div.id)
                        // el.remove()
                    },
                    onfocus: function () {
                        this.setBackground(tool.style.background || "#1859a0");
                    },
                    onblur: function () {
                        this.setBackground(tool.style.background_blur || "#3d4756");
                    },
                    onmove: function (x, y) {
                        if (tool.style.show_position || false) {
                            this.setTitle(this.title.split('-')[0] +
                                " - x: " + x + ", " +
                                "y: " + y
                            );
                        }
                    },
                    onresize: function (width, height) {
                        if (tool.style.show_size || false) {
                            this.setTitle(this.title.split('-')[0] +
                                " - w: " + width + ", " +
                                "h: " + height
                            );
                        }
                    },
                });

                ct.tool.data.winboxs.push(winbox)
                document.getElementById(winbox.id).style.zIndex = 1000
                document.getElementById(winbox.id).style.borderRadius = tool.style.borderRadius || '5px'

                // tool_div.addEventListener('dom-ready', e => {
                //     tool_div.openDevTools();
                //     tool_div.executeJavaScript()

                // });

            }
        },
        open_tool_window: function (tool) {
            let src = path.join(tool.path, tool.html)
            tool.src = src
            ipcRenderer.send('new_tool_window', tool)
        },
        open_tool_url: function (tool) {

            let winbox_id = 'winbox-' + tool.id

            let ele = document.getElementById(winbox_id)
            if (ele != undefined) {
                // alert('插件已打开')
                ct.tool.show(tool)
            } else {
                let pos = this.calc_position(tool)

                let winbox = new WinBox({
                    id: winbox_id,
                    title: tool.name,
                    url: tool.url,
                    // 样式
                    x: pos.x || "center",
                    y: pos.y || "center",
                    width: tool.style.width || "50%",
                    height: tool.style.height || "50%",
                    background: tool.style.background || "#1859a0",
                    border: tool.style.border || 3,

                    // 关闭本插件面板的同时，删除插件的函数
                    onclose: function () {
                        let tool_id = (this.id).replace('winbox-', '')
                        delete ct.tools[tool_id]
                    },
                    onfocus: function () {
                        this.setBackground(tool.style.background || "#1859a0");
                    },
                    onblur: function () {
                        this.setBackground(tool.style.background_blur || "#3d4756");
                    },
                    onmove: function (x, y) {
                        if (tool.style.show_position || false) {
                            this.setTitle(this.title.split('-')[0] +
                                " - x: " + x + ", " +
                                "y: " + y
                            );
                        }
                    },
                    onresize: function (width, height) {
                        if (tool.style.show_size || false) {
                            this.setTitle(this.title.split('-')[0] +
                                " - w: " + width + ", " +
                                "h: " + height
                            );
                        }
                    },
                });
                ct.tool.data.winboxs.push(winbox)
                document.getElementById(winbox.id).style.zIndex = 1000
                document.getElementById(winbox.id).style.borderRadius = tool.style.borderRadius || '5px'
            }
        },
        show: function (tool) {
            let tool_key = ipcRenderer.sendSync('get_tool_key', tool)
            // let winbox_id = 'winbox-' + ct.util.make_tool_id(tool) || tool
            let winbox_id = 'winbox-' + tool_key
            ct.tool.data.winboxs.forEach(winbox => {
                if (winbox.id == winbox_id) {
                    if (winbox.min == true) {
                        // minimize函数会在最小化和还原中切换
                        winbox.minimize()
                    }
                    tool.style.x = winbox.x
                    tool.style.y = winbox.y
                    let pos = ct.tool.calc_position(tool)
                    winbox.x = pos.x
                    winbox.y = pos.y
                    console.log(pos);
                    winbox.focus()
                }
            })
        },
        calc_position: function (tool) {
            let w = document.body.clientWidth
            let h = document.body.clientHeight
            let pos = {}
            pos.x = tool.style.x > w ? w / 2 : tool.style.x
            pos.y = tool.style.y > h ? h / 2 : tool.style.y
            return pos
        },
        save_config: function (tool) {
            let str = JSON.stringify(tool)
            fs.writeFileSync(path.join(tool.path, 'tool.config.json'), str)
        },
        /**
         * 关闭所有工具
         * @returns 
         */
        close_all: function () {
            return new Promise((resolve, reject) => {
                while (ct.tool.data.winboxs.length > 0) {
                    let winbox = ct.tool.data.winboxs.pop()
                    winbox.close()
                }
                resolve('已关闭所有工具')
            });
        },
        show_detail: function (tool) {
            let html = `<div>${tool}</div>`
            new WinBox({
                title: "Set innerHTML",
                html: html
            });
        },
    }
})(ct)