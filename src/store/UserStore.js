import { defineStore } from 'pinia'

export const useTodoStore = defineStore({
  id: 'todo',
  state: () => ({
    todos: []
  }),
  getters: {
    totalTodos() {
      return this.todos.length
    }
  },
  actions: {
    addTodo(todo) {
      this.todos.push(todo)
    }
  }
})