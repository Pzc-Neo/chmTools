module.exports = {
    /**
     * 获取tool_key(这个相当于工具的身份标志)
     * @param {Object} tool_config 解析后的tool.json
     * @returns 
     */
    make_tool_key: function (tool_config) {
        const md5 = require('js-md5')
        let version = tool_config.version.replace(/\./g, '_')
        let author_md5 = md5(tool_config.author)
        let tool_key = tool_config.id + '-' + version + '-' + author_md5
        return tool_key
    }
}