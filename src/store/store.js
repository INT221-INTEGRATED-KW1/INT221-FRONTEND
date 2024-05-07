import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', () => {
  const taskList = []
  const resStatus = ""
  const errorRes = "Done"
  const isLoading = false
  function findTaskIndexById(id) {
    const index = taskList.findIndex((task) => task.id == id)
    return index
  }
  
  return { taskList , findTaskIndexById , resStatus , errorRes ,isLoading}
})
