/**
 * control element
 */
(function (ct) {
    "use strict"
    ct.el = {
        remove_class: function (selector, class_str, is_element) {

            let els = []

            if (is_element) {
                els = selector
            } else {
                els = document.querySelectorAll(selector)
            }

            // if (!Array.isArray(els)) {
            //     els = [els]
            // }
            // console.log(Array.isArray(els));

            for (let i = 0; i < els.length; i++) {
                const el = els[i];

                let class_list = el.className.split(' ')
                let result = ""
                for (let index = 0; index < class_list.length; index++) {
                    const class_name = class_list[index];
                    if (class_name !== class_str) {
                        result += class_name + ' '
                    }
                }
                el.className = result.trim()
            }
        },

        add_class: function (selector, class_str, is_element) {

            let els = []

            if (is_element) {
                els = selector
            } else {
                els = document.querySelectorAll(selector)
            }

            // if (!Array.isArray(els)) {
            //     els = [els]
            // }

            let result = ''

            for (let index = 0; index < els.length; index++) {
                const el = els[index];
                result = el.className + ' ' + class_str
                el.className = result.replace(/[ ]+/g, ' ')
                // el.className = result.replace(/[ ]+/g, ' ')
            }
        },
    }
})(ct)