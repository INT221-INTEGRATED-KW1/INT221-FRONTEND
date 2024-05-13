import router from '@/router/router'
import { ref } from 'vue'
import { getMethod } from './fetchAPI'
const statusMap = {
  NO_STATUS: 'No Status',
  TO_DO: 'To Do',
  DOING: 'Doing',
  DONE: 'Done'
}

const statusReverseMap = {}
for (const key in statusMap) {
  statusReverseMap[statusMap[key]] = key
}

const statusColors = {
  red: 'bg-red-200 text-red-800',
  orange: 'bg-orange-200 text-orange-800',
  amber: 'bg-amber-200 text-amber-800',
  yellow: 'bg-yellow-200 text-yellow-800',
  blue: 'bg-blue-200 text-blue-800',
  indigo: 'bg-indigo-200 text-indigo-800',
  violet: 'bg-violet-200 text-violet-800',
  purple: 'bg-purple-200 text-purple-800',
  pink: 'bg-pink-200 text-pink-800',
  rose: 'bg-rose-200 text-rose-800',
  fuchsia: 'bg-fuchsia-200 text-fuchsia-800',
  lime: 'bg-lime-200 text-lime-800',
  green: 'bg-emerald-200 text-emerald-800',
  teal: 'bg-teal-200 text-teal-800',
  cyan: 'bg-cyan-200 text-cyan-800',
  grey: 'bg-slate-200 text-gray-500 italic'
}


const dataList = ref({})

async function onMountSetup(database) {
  const mode = router.currentRoute.value.name ?? 'detail'
  // console.log(mode);
  const id = router.currentRoute.value.params.id ?? ''
  try {
    const taskRes = await getMethod(`${database}/${id}`)
    console.log("taskRes")
    dataList.value = taskRes.data
    if (database == 'tasks') {
      dataList.value.createdOn = formatToLocalTime(dataList.value.createdOn)
      dataList.value.updatedOn = formatToLocalTime(dataList.value.updatedOn)
    }
    console.log(dataList.value);
    return dataList.value
  } catch (error) {
    throw error
    // router.push('/task')
  }
}

function formatStatus(status) {
  return statusMap[status] || null
}

function formatStatusReverse(text) {
  return statusReverseMap[text] || null
}

function colorStatus(status) {
  return statusColors[status] || 'bg-slate-200 text-grey italic'
}

function alert(item) {
  window.alert(`Failed for : ${item}`)
}

function formatToLocalTime(timeStr) {
  const inputTime = new Date(timeStr)
  const formattedTime = inputTime.toLocaleString('en-GB').replace('T', ' ')
  return formattedTime
}

function alertMessage(status) {
  const alertmsg = {
    addDone: {
      message: 'The task has been successfully added',
      css: 'alert alert-success bg-green-200'
    },
    editDone: {
      message: 'The task has been updated',
      css: 'alert alert-success border-sky-500 bg-sky-200'
    },
    deleteDone: {
      message: 'The task has been deleted',
      css: 'alert alert-success bg-green-200'
    },
    updateError: {
      message: 'The update was unsuccessful',
      css: 'alert alert-error bg-red-200'
    },
    deleteError: {
      message: 'An error has occurred, the task does not exist.',
      css: 'alert alert-error bg-red-200'
    }
  }
  if (alertmsg.hasOwnProperty(status)) {
    const obj = alertmsg[status]
    return { message: obj.message, css: obj.css }
  } else {
    return false
  }
}

export {
  formatStatus,
  formatStatusReverse,
  colorStatus,
  alert,
  formatToLocalTime,
  onMountSetup,
  statusColors,
  alertMessage
}
