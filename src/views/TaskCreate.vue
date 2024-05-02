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
  isInValid.value = false
  if (!TaskDetail.value.title) {
    return (isInValid.value = true)
  } else {
    Object.assign(TaskDetail.value, {
      title: TaskDetail.value.title.trimEnd(),
      assignees: !TaskDetail.value.assignees ? null : TaskDetail.value.assignees.trimEnd(),
      status: formatStatusReverse(TaskDetail.value.status),
      description: !TaskDetail.value.description ? null : TaskDetail.value.description.trimEnd()
    })
    // console.log(TaskDetail.value)
    // let addtask function and send out info into the main page :D
    const result = await addTask(TaskDetail.value)
    store.taskList.push(result.data)
    // console.log(store.taskList);
    router.push('/task')
    // console.log(result.resCode);
  }
}

const inputField = 'p-2 col-span-3 hover:bg-slate-400 hover:bg-opacity-20 duration-150 rounded-md'
const header = 'text-gray-900 text-opacity-50 font-semibold'
</script>
<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-md text-slate-900"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40 itbkk-button"
      @click="router.push(`/task`)"
    ></div>

    <div
      name="detail"
      class="fixed w-[640px] h-4/6 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center"
    >
      <div class="w-auto flex flex-row justify-between m-12 mb-0">
        <div>Create New Task .</div>
      </div>
      <div v-if="isInValid" class="kbd kbd-md mx-12 bg-red-300">invalid title required!!!!</div>
      <div class="overflow-y-auto h-full m-12 my-0 mb-4">
        <input
          type="text"
          placeholder="Untitled"
          v-model="TaskDetail.title"
          :autofocus="!TaskDetail.title ? '' : (TaskDetail.title = TaskDetail.title.trimStart())"
          class="itbkk-title w-full h-auto text-2xl font-bold mb-4 break-words inline-block border border-none"
        />
        <div class="grid grid-cols-4 gap-y-2 text-md items-center">
          <span :class="header"> Status </span>
          <select
            class="select select-bordered select-sm w-full text-base p-0"
            :class="inputField"
            v-model="TaskDetail.status"
          >
            <option disabled selected>No Status</option>
            <option>To Do</option>
            <option>Doing</option>
            <option>Done</option>
          </select>
          <!-- <input type="test" v-model="TaskDetail.status" placeholder="Empty" :class="inputField" /> -->
          <span :class="header" class="col-span-1" > Assignees </span>
          <input
            type="test"
            v-model="TaskDetail.assignees"
            placeholder="Empty"
            :class="inputField"
            :autofocus="!TaskDetail.assignees ? '' : (TaskDetail.assignees = TaskDetail.assignees.trimStart())"
          />
          <span :class="header" class="col-span-1"> Timezone </span>
          <div v-text="timezone" class="itbkk-timezone col-span-3 p-2"></div>
          <span :class="header" class="col-span-1">CreateOn</span>
          <div v-text="date" class="itbkk-created-on col-span-3 p-2"></div>
          <span class="col-span-1">UpdateOn</span>
          <div v-text="date" class="itbkk-updated-on col-span-3 p-2"></div>
        </div>
        <div class="w-full flex flex-col gap-2">
          <span :class="header" class="w-full divider divider-start">Description</span>
          <textarea placeholder="Hi" v-model="TaskDetail.description" class="w-full" :autofocus="!TaskDetail.description ? '' : (TaskDetail.description = TaskDetail.description.trimStart())"></textarea>
        </div>
      </div>
      <div class="right-0 m-12 mt-0 flex justify-center gap-4">
        <button @click="addNewTask()" class="btn bg-green-400">Save</button>
        <button @click="router.push('/task')" class="btn bg-grey-400">Cancel</button>
      </div>
    </div>
  </div>
</template>
<style></style>
