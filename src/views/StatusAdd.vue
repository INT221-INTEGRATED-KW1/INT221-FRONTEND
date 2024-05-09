<script setup>
import { addTask } from '@/lib/fetchAPI'
import { formatStatusReverse } from '@/lib/util'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const TaskDetail = ref({
  title: null,
  assignees: null,
  status: null,
  description: null
})

const store = useTaskStore()
const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const date = ref(new Date().toLocaleString('en-GB').replace('T', ' '))

const isInValid = ref(false)
async function addNewTask() {
  store.resStatus = ''
  isInValid.value = false
  if (!TaskDetail.value.title) {
    return (isInValid.value = true)
  } else {
    Object.assign(TaskDetail.value, {
      title: TaskDetail.value.title.trim(),
      assignees: !TaskDetail.value.assignees ? null : TaskDetail.value.assignees.trim(),
      status: TaskDetail.value.status,
      description: !TaskDetail.value.description ? null : TaskDetail.value.description.trim()
    })
    // let addtask function and send out info into the main page :D
    const result = await addTask(TaskDetail.value)
    store.taskList.push(result.data)
    store.resStatus = 'addDone'
    router.push('/task')
    // setInterval(store.resStatus = "", 5000)
  }
}
// console.log(TaskDetail.value);
const inputField = 'p-2 col-span-3 hover:bg-slate-400 hover:bg-opacity-20 duration-150 rounded-md'
const header = 'text-gray-900 text-opacity-50 font-semibold'
</script>
<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-md text-slate-900"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40"
      @click="router.push(`/status`)"
    ></div>

    <div
      name="detail"
      class="fixed w-[640px] h-5/6 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center"
    >
      <div class="w-auto flex flex-row justify-between m-12 mb-0 font-bold">
        <div>Add Status</div>
      </div>
      <div v-if="isInValid" class="kbd kbd-md mx-12 bg-red-300">invalid title required!!!!</div>
      <div class="overflow-y-auto h-full m-12 my-0 mb-4">
        <div class="w-full flex flex-col gap-2">
          <span :class="header" class="w-full divider divider-start"><b>Name</b></span>
          <textarea
            maxlength="50"
            v-model="TaskDetail.description"
            class="itbkk-description w-full h-28"
          ></textarea>
        </div>
        <div class="w-full flex flex-col gap-2">
          <span :class="header" class="w-full divider divider-start"><b>Description</b></span>
          <textarea
            maxlength="50"
            v-model="TaskDetail.description"
            class="itbkk-description w-full h-28"
          ></textarea>
        </div>
      </div>
      <div class="right-0 m-12 mt-0 flex justify-center gap-4">
        <button @click="addNewTask()" class="itbkk-button-confirm btn bg-green-400 " :disabled="!TaskDetail.title">Save</button>
        <button @click="router.push('/task')" class="itbkk-button-cancel btn bg-grey-400">Cancel</button>
      </div>
    </div>
  </div>
</template>
<style></style>