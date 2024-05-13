<script setup>
import { addMethod } from '@/lib/fetchAPI'
import { colorStatus } from '@/lib/util'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
// console.log('add');
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
    // let addMethod function and send out info into the main page :D
    const result = await addMethod(TaskDetail.value, 'tasks')
    store.taskList.push(result.data)
    store.resStatus = 'addDone'
    router.push({ name: 'task' })
    store.ToastMessage = {
      msg: 'The task has been successfully added',
      color: 'green'
    }
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
      @click="router.push({ name: 'task' })"
    ></div>

    <div
      name="detail"
      class="fixed w-[640px] h-4/6 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center"
    >
      <div class="w-auto flex flex-row justify-between m-12 mb-0 font-bold">
        <div>Create New Task</div>
      </div>
      <div v-if="isInValid" class="kbd kbd-md mx-12 bg-red-300">invalid title required!!!!</div>
      <div class="overflow-y-auto h-full m-12 my-0 mb-4">
        <input
          type="text"
          maxlength="100"
          placeholder="Untitled"
          v-model="TaskDetail.title"
          :autofocus="!TaskDetail.title ? '' : (TaskDetail.title = TaskDetail.title.trimStart())"
          class="itbkk-title w-full h-auto text-2xl font-bold mb-4 break-words inline-block border border-none"
        />
        <div class="grid grid-cols-4 gap-y-2 text-md items-center">
          <span :class="header"> Status </span>
          <select
            class="itbkk-status select select-bordered select-md w-full text-base p-0"
            :class="inputField"
            v-model="TaskDetail.status"
          >
            <option disabled selected>Pick one</option>
            <option
              v-for="status in store.statusList"
              :key="status.id"
              :value="status.id"
              :class="colorStatus(status.color)"
            >
              {{ status.name }}
            </option>
          </select>
          <!-- <input type="test" v-model="TaskDetail.status" placeholder="Empty" :class="inputField" /> -->
          <span :class="header" class="col-span-1"> Assignees </span>
          <input
            type="test"
            maxlength="30"
            v-model="TaskDetail.assignees"
            placeholder="Empty"
            class="itbkk-assignees"
            :class="inputField"
          />
        </div>
        <div class="w-full flex flex-col gap-2">
          <span :class="header" class="w-full divider divider-start">Description</span>
          <textarea
            maxlength="500"
            placeholder="Hi"
            v-model="TaskDetail.description"
            class="itbkk-description w-full max-h-48 min-h-48"
            :class="inputField"
          ></textarea>
        </div>
      </div>
      <div class="right-0 m-12 mt-0 flex justify-center gap-4">
        <button
          @click="addNewTask()"
          class="itbkk-button-confirm btn bg-green-400"
          :disabled="!TaskDetail.title"
        >
          Save
        </button>
        <button @click="router.push({ name: 'task' })" class="itbkk-button-cancel btn bg-grey-400">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
<style></style>
