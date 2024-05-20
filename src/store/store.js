import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', () => {
  const taskList = []
  const statusList = []
  const currentItem = {}
  const resStatus = ''
  const errorRes = 'Done'
  const isError = false
  const ErrorMessage = null
  const isComplete = false
  const ToastMessage = null
  const isLoading = false
  
  //About the limit.
  const maxTask = 10
  const limitSwitch = false
  const limitTrigger = false
  const limitInfo = []

  function findTaskIndexById(id) {
    const index = taskList.findIndex((task) => task.id == id)
    return index
  }
  function findIndexById(data, id) {
    console.log(id);
    const index = (data).findIndex((item) => item.id == id)
    return index
  }

  return { taskList, statusList, findTaskIndexById, resStatus, errorRes, isLoading, currentItem , findIndexById, isError, ErrorMessage, ToastMessage, maxTask, limitSwitch, limitTrigger, limitInfo}
})
