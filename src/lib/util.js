import router from '@/router/router'
import { ref, toHandlerKey } from 'vue'
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
  grey: 'bg-slate-200 text-gray-500 italic',
  orange: 'bg-orange-200 text-orange-800',
  blue: 'bg-blue-200 text-blue-800',
  green: 'bg-emerald-200 text-emerald-800',
  purple: 'bg-purple-200 text-purple-800',
  pink: 'bg-pink-200 text-pink-800',
  red: 'bg-red-200 text-red-800',
  yellow: 'bg-yellow-200 text-yellow-800',
  indigo: 'bg-indigo-200 text-indigo-800',
  teal: 'bg-teal-200 text-teal-800',
  gray: 'bg-gray-200 text-gray-800',
  cyan: 'bg-cyan-200 text-cyan-800',
  lime: 'bg-lime-200 text-lime-800',
  amber: 'bg-amber-200 text-amber-800',
  rose: 'bg-rose-200 text-rose-800',
  violet: 'bg-violet-200 text-violet-800',
  fuchsia: 'bg-fuchsia-200 text-fuchsia-800'
}

const dataList = ref({})

async function onMountSetup(database) {
  const mode = router.currentRoute.value.name ?? 'detail'
  // console.log(mode);
  const id = router.currentRoute.value.params.id ?? ''
  try {
    const taskRes = await getMethod(`${database}/${id}`)
    // console.log(taskRes)
    dataList.value = taskRes.data
    if (database == 'tasks') {
      dataList.value.createdOn = formatToLocalTime(dataList.value.createdOn)
      dataList.value.updatedOn = formatToLocalTime(dataList.value.updatedOn)
    }
    // console.log(dataList.value);
    return dataList.value
  } catch (error) {
    return { getMode: mode, error: error }
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

export {
  formatStatus,
  formatStatusReverse,
  colorStatus,
  alert,
  formatToLocalTime,
  onMountSetup,
  statusColors
}
