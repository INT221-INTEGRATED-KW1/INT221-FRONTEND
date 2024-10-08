import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const taskList = ref([])
  const statusList = ref([])
  const boardList = ref([])
  const collabList = ref([])
  const currentItem = {}
  const resStatus = ''
  const errorRes = 'Done'
  const isError = false
  const ErrorMessage = null
  const ToastMessage = ref([])
  const isLoading = false
  const isLogin = ref(localStorage.getItem('token') ? true : false)
  //About the limit.
  const maxTask = 10
  const limitSwitch = false
  const limitInfo = null

  function findTaskIndexById(id) {
    const index = taskList.value.findIndex((task) => task.id == id)
    return index
  }
  function findIndexById(data, id) {
    console.log(id)
    const index = data.findIndex((item) => item.id == id)
    return index
  }

  return {
    taskList,
    statusList,
    boardList,
    collabList,
    findTaskIndexById,
    resStatus,
    errorRes,
    isLoading,
    currentItem,
    findIndexById,
    isError,
    ErrorMessage,
    ToastMessage,
    maxTask,
    limitSwitch,
    limitInfo,
    isLogin
  }
})
