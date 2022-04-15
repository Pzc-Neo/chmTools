(function (cw) {
    "use strict";

    cw.util = {
        /**
         * 生成随机字符串 - 前缀+时间戳+随机字符串
         * @param {String} str 前缀(要包含的字符串)
         * @param {Number} len 随机字符串长度
         * @returns 随机字符串
         */
        random_str: function (str, len) {
            var timestamp = Date.parse(new Date())
            len = len || 6;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符LoOl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return str + "-" + timestamp + "-" + pwd
        },
        /**
         * 日期格式化
         * @param {String} fmt 日期格式(年：Y; 月：m；日：d；时：H；分：M；秒：S)
         * @param {Date} date 日期
         * @returns 格式化后的日期
         */
        date_format: function (fmt, date) {
            if (fmt == "default") {
                fmt = "YYYY-mm-dd HH:MM:SS"
            } else if (fmt == 'backup_file') {
                fmt = "YYYY年mm月dd日-HH时MM分SS秒"
            }
            let ret;
            const opt = {
                "Y+": date.getFullYear().toString(), // 年
                "m+": (date.getMonth() + 1).toString(), // 月
                "d+": date.getDate().toString(), // 日
                "H+": date.getHours().toString(), // 时
                "M+": date.getMinutes().toString(), // 分
                "S+": date.getSeconds().toString() // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
            };
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            return fmt;
        },
        open_folder_sys: function (folder) {
            let folder_path = path.join(__dirname, folder)
            require('child_process').exec('start "" ' + folder_path);
        },
        open_folder: function (dir_path) {
            require('child_process').exec('start "" ' + dir_path);
        },
        remove_repeat: function (arr) {
            //  方法1：利用对象访问属性的方法，判断对象中是否存在key
            var result = [];
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                if (!obj[arr[i].key]) {
                    result.push(arr[i]);
                    obj[arr[i].key] = true;
                }
            }
            console.log(result);
            console.log('result');
            return result
        },
        make_qrcode: function (canva_selector, text) {
            // qrcode库来源：https://www.npmjs.com/package/qrcode
            let QRCode = require('qrcode')
            let canvas = document.querySelector(canva_selector)

            QRCode.toCanvas(canvas, text, function (error) {
                if (error) console.error(error)
                console.log('生成二维码成功');
            })
        },
        screen_shot: function () {
            const screenshot = require('screenshot-desktop')

            screenshot().then((img) => {
                // img: Buffer filled with jpg goodness
                // ...
            }).catch((err) => {
                // ...
            })
        },
        /**
         * 获取内网ip地址
         */
        get_ip: function () {
            // ip库来源：https://www.npmjs.com/package/ip
            var ip = require('ip');
            let ip_address = ip.address() // my ip address
            console.log(ip_address);
        },
        make_tool_id: function (configs) {
            let version = configs.version.replace(/\./g, '_')
            let tool_id = configs.id + '-' + version
            return tool_id
        },
    }
})(ct)