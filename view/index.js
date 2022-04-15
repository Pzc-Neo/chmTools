ct.view = {
    data: {
        configs: {
            theme_path: path.join(__dirname, '/css/themes')
        },
        selected: {
            option: 12
        },
        themes: [],
        // 点击右键时候的event
        contextmenu_ev: {},
    },
    init: function () {
        this.get_theme_list()
        // this.change_theme('./css/themes/dark/index.css')

        ct.group.init()

        ct.tool.init()

        document.querySelector('#app').addEventListener('click', ev => {
            ct.view.hide_contextmenu()
        })
    },
    get_theme_list: function () {
        fs.readdir(this.data.configs.theme_path, function (err, theme_dirs) {
            if (err) {
                ct.debug.show_err(err)
            } else {
                for (let index = 0; index < theme_dirs.length; index++) {
                    const theme_dir = theme_dirs[index];
                    let theme_config_path = path.join(ct.view.data.configs.theme_path, theme_dir, 'theme.json')
                    let theme_config = require(theme_config_path)

                    theme_config.path = path.join(ct.view.data.configs.theme_path, theme_dir, 'index.css')
                    ct.view.data.themes.push(theme_config)

                    ct.view.change_theme(ct.view.data.themes[0].path)
                }
            }
        })
    },
    change_theme: function (theme_path) {
        document.querySelector('#app_theme').setAttribute('href', theme_path)
    },
    set_icon: function () {},

    switch_panel: function (panel_class) {
        ct.el.remove_class('.chmST_option_bar .option.selected', 'selected')
        ct.el.add_class(`.chmST_option_bar .option.${panel_class}`, 'selected')

        ct.el.remove_class('.chmST_content.selected', 'selected')
        ct.el.add_class(`.chmST_content.${panel_class}`, 'selected')
    },

    app_command: function (command, arg) {
        let result = ipcRenderer.sendSync('app_command', command)
        if (command == "window_always_on_top") {
            cw.view.win_always_on_top = result
            cw.view.show_notification(arg)
            // } else if (command == "window_maximize") {
            //     if (result == "最大化") {
            //         this.style_editor_content.width = '55%'
            //     } else {
            //         this.style_editor_content.width = '100%'
            //     }
        }
    },
    /**
     * 显示右键菜单
     * @param {Object} event 右键点击事件
     * @param {String} selector 要显示的菜单的css选择器
     */
    show_contextmenu: function (event, selector) {
        event.preventDefault()

        this.data.contextmenu_ev = event

        let x = event.pageX
        let y = event.pageY

        // 如果鼠标指针的位置超过软件高度的一半的话，菜单就显示在指针上面
        let height = document.body.clientHeight
        if (y > height / 2) {
            let my_div = document.getElementById("tool_contextmenu");
            let h = window.getComputedStyle(my_div, null).height
            if (h != 'auto') {
                y = y - parseInt(h)
            }
        }

        // 菜单外层
        let menu = document.querySelector('#tool_contextmenu')
        menu.style.display = 'block'
        menu.style.left = x + 'px'
        menu.style.top = y + 'px'

        // 菜单最外层的id
        let menu_container = '#tool_contextmenu'

        let menu_selector = `${menu_container} .menu`

        // class包含selected的菜单会显示，这里先移除已经包含selected的dom的selected
        ct.el.remove_class(`${menu_selector}.selected`, 'selected')

        let el = document.querySelector('#tool_contextmenu' + ' ' + selector)
        ct.el.add_class([el], 'selected', true)
    },
    hide_contextmenu: function () {
        document.querySelector('#tool_contextmenu').style.display = 'none'
        // document.querySelector('#tool_contextmenu .tool_list').style.display = 'none'
    },
    /**
     * 显示颜色代表的工具类型信息
     */
    show_color_info: function () {
        let html = `
        <div style="box-sizing:border-box; padding:15px">
            <div class="one_row">
            颜色代表的工具类型
            </div>
            <div class="one_row">
                <span class="chmST_tool_type chmCL_tool_type window" style="width:50px"></span>
                <span>window</span>
            </div>
            <div class="one_row">
                <span class="chmST_tool_type chmCL_tool_type html" style="width:50px"></span>
                <span>html</span>
            </div>
            <div class="one_row">
                <span class="chmST_tool_type chmCL_tool_type url" style="width:50px"></span>
                <span>url</span>
            </div>
            <div class="one_row">
                <span class="chmST_tool_type chmCL_tool_type webview" style="width:50px"></span>
                <span>webview</span>
            </div>
        </div>
        `
        new WinBox({
            title: '颜色说明',
            html: html,
            width: 190,
            height: 180,
            x: 'center',
            y: 'center',
            background: "#3478c1",
            border:3
        });
    },
    toggle_sub_menu: function (event, menu) {
        let el = document.querySelector('.chmST_sub_menu.show')
        if (el == null) {
            this.open_sub_menu(event, menu)
        } else {
            this.hide_sub_menu()
        }
    },
    /**
     * 打开子菜单
     * @param {Object} event 点击事件
     * @param {String} menu 菜单名称
     */
    open_sub_menu: function (event, menu) {
        event.stopPropagation()

        ct.el.remove_class(`.chmST_sub_menu.show`, 'show')
        ct.el.add_class(`.chmST_sub_menu`, 'show')

        ct.el.remove_class('.chmST_sub_menu .menu_list.selected', 'selected')
        ct.el.add_class(`.chmST_sub_menu .menu_list.${menu}`, 'selected')

        // 获取当前鼠标位置，并修改菜单位置
        let temp_x = event.target.getBoundingClientRect().x - 1
        let temp_y = event.target.getBoundingClientRect().y + event.target.getBoundingClientRect().height
        let el_sub_menu = document.querySelector('.chmST_sub_menu')
        el_sub_menu.style.top = temp_y + 'px'
        el_sub_menu.style.left = temp_x + 'px'
    },
    /**
     * 隐藏子菜单
     */
    hide_sub_menu: function () {
        ct.el.remove_class(`.chmST_sub_menu.show`, 'show')
    },
    /**
     * 如果子菜单已经打开，那么鼠标悬浮到哪个菜单就显示哪个菜单
     * @param {Object} event 鼠标悬浮事件
     * @param {String} menu 菜单名称
     */
    show_sub_menu: function (event, menu) {
        let el = document.querySelector('.chmST_sub_menu.show')
        if (el !== null) {
            this.open_sub_menu(event, menu)
        }
    },

}

ct.view.init()