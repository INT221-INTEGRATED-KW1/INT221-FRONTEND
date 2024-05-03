import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', () => {
  const taskList = []

  const resStatus = ""

  const requestMode = ""
  function findTaskIndexById(id) {
    const index = taskList.findIndex((task) => task.id == id)
    return index
  }
  return { taskList, findTaskIndexById , resStatus, requestMode}
})
