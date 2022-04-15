const { ipcRenderer } = require("electron")

let configs = require("../tool.config.json")
let tool_key = require("electron").ipcRenderer.sendSync("get_tool_key", configs)

const fs = require("fs")
const path = require("path")

var app = new Vue({
  el: "#app",
  data: {
    app_name: configs.name + " v" + configs.version,
    win_always_on_top: false,
    todo_file: path.join(__dirname, "data", "todos.json"),
    finished_file: path.join(__dirname, "data", "finished.json"),
    content: "",
    todos: [],
    finished_todos: [],
    isShowFinished: false,
  },
  created() {
    this.loadTodo()
  },
  // computed: {
  //   todo_list() {
  //     return this.isShowFinished ? this.todos : this.finished_todos
  //   },
  // },

  methods: {
    loadTodo() {
      const str = fs.readFileSync(this.todo_file)
      this.todos = JSON.parse(str)
      const finished_str = fs.readFileSync(this.finished_file)
      this.finished_todos = JSON.parse(finished_str)
    },
    addTodo() {
      const todo = {
        id: this.make_id(5),
        content: this.content,
        created: new Date().getTime(),
        done: false,
      }
      this.todos.unshift(todo)
      this.content = ""
    },
    edit(todo, event) {
      const el = event.target
      const editBox = document.createElement("input")
      editBox.value = todo.content
      editBox.className = "edit_box"
      editBox.spellcheck = false
      el.appendChild(editBox)
      editBox.focus()

      editBox.addEventListener("keyup", (ev) => {
        if (ev.key === "Enter") {
          editBox.blur()
          saveEdit(ev)
        }
        if (ev.key === "Escape") {
          editBox.blur()
        }
      })
      editBox.addEventListener("blur", (ev) => {
        editBox.remove()
        saveEdit(ev)
      })

      const that = this
      const saveEdit = (ev) => {
        const value = ev.target.value.trim()
        if (value && value != todo.content) {
          todo.content = value
        }
      }
    },
    removeTodo(todo) {
      this.todos = this.todos.filter((_todo) => {
        return _todo.id !== todo.id
      })
    },
    removeFinished() {
      const finisheds = this.todos.filter((todo) => {
        return !todo.done
      })
      this.todos = finisheds
      this.finished_todos = [...this.finished_todos, ...finisheds]
    },
    make_id(len) {
      const result = new Date().getTime().toString()

      const str = "abcdefghijklmnopqrstuvwxyz"
      let str1 = "-"
      while (len >= 0) {
        const index = Math.floor(Math.random() * str.length)
        str1 += str[index]
        len--
      }
      return result + str1
    },
    handle_drap_over: function (ev) {
      ev.preventDefault()
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

      if (drap_type == drop_type) {
        let todo = this.todos.splice(drap_index, 1)[0]
        this.todos.splice(drop_index, 0, todo)
      }
    },

    win_close: function () {
      ipcRenderer.sendSync(tool_key, "win_close")
    },
    app_command: function (command) {
      let result = ipcRenderer.sendSync(tool_key, command)
      if (command == "win_always_on_top") {
        this.win_always_on_top = result
      }
    },
  },
  computed: {
    finished() {
      return this.todos.reduce((pre, todo) => {
        return pre + (todo.done ? 1 : 0)
      }, 0)
    },
  },
  watch: {
    todos: {
      deep: true,
      handler(todos) {
        fs.writeFile(this.todo_file, JSON.stringify(todos), (err) => {
          if (err) {
            alert(err)
          } else {
            console.log("已把待办事项保存到本地")
          }
        })
      },
    },
    finished_todos: {
      deep: true,
      handler(todos) {
        fs.writeFile(this.finished_file, JSON.stringify(todos), (err) => {
          if (err) {
            alert(err)
          } else {
            console.log("已把已完成的保存到本地")
          }
        })
      },
    },
  },
})
