(function (ct) {
    ct.debug = {
        log_err: function (info) {
            let log_date = ct.util.date_format('default', new Date())
            info =
                `\n<<--------------------------\n${info}\n${log_date}\n-------------------------->>\n`
            fs.writeFileSync('./ct.err.log', info, {
                flag: 'a'
            })
        },
        /**
         * 记录、弹出(可选)错误信息
         * @param {string} err_code 抛出错误的函数
         * @param {string} err_info 错误信息
         * @param {boolean} is_alert 是否弹出警告对话框
         */
        show_err: function (err_code, err_info, is_alert) {
            let info = "Execute function: " + err_code + "\n" + err_info + "\n" + new Error().stack

            this.log_err(info)

            is_alert = is_alert || true
            if (is_alert) {
                alert(info)
            }
        },
        show_notification: function (notification, display_time) {

            notification = notification.replace(/\[(.+?)\]/g, `<span style="color:#fff;font-weight:bold">$1</span>`) || notification

            this.notification = notification
            this.style_notification.display = 'block'

            let temp = {}
            temp.notification = notification
            temp.date = cw.util.date_format('default', new Date())
            this.notification_history_list.push(temp)

            display_time = display_time || 1500
            setTimeout(function () {
                cw.view.notification = ''
                cw.view.style_notification.display = 'none'
            }, display_time)
        },
    }
})(ct)