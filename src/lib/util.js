import router from "@/router/router";
import { ref, toHandlerKey } from "vue";
import { getTask } from "./fetchAPI";
const statusMap = {
  'NO_STATUS': 'No Status',
  'TODO': 'To Do',
  'DOING': 'Doing',
  'DONE': 'Done'
};

const statusReverseMap = {};
for (const key in statusMap) {
  statusReverseMap[statusMap[key]] = key;
}

const statusColors = {
  'NO_STATUS': 'bg-slate-200 text-grey italic',
  'TODO': 'bg-orange-200 text-orange-800',
  'DOING': 'bg-blue-200 text-blue-800',
  'DONE': 'bg-emerald-200 text-emerald-800'
};

const taskDetail = ref({})
async function onMountSetup() {
  const mode = router.currentRoute.value.name ?? "detail"
  // console.log(mode);
  const id = router.currentRoute.value.params.id
  try {
    const taskRes = await getTask(`tasks/${id}`)
    // console.log(taskRes)
    taskDetail.value = taskRes.data
    taskDetail.value.createdOn = formatToLocalTime(taskDetail.value.createdOn)
    taskDetail.value.updatedOn = formatToLocalTime(taskDetail.value.updatedOn)
    // console.log(taskDetail.value);
    return taskDetail.value
  } catch (error) {
    return {getMode: mode ,error: error}
    // router.push('/task')
  }
}


function formatStatus(status) {
  return statusMap[status] || null;
}

function formatStatusReverse(text) {
  return statusReverseMap[text] || null;
}

function colorStatus(status) {
  return statusColors[status] || 'bg-slate-200 text-grey italic';
}

function alert(item) {
  window.alert(`Failed for : ${item}`);
}

function formatToLocalTime(timeStr) {
  const inputTime = new Date(timeStr)
  const formattedTime = inputTime.toLocaleString('en-GB').replace('T', ' ')
  return formattedTime
}



export { formatStatus, formatStatusReverse, colorStatus, alert , formatToLocalTime, onMountSetup};