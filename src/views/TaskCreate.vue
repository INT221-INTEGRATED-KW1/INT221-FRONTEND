<script setup>
import { addMethod } from '@/lib/fetchAPI'
import { colorStatus } from '@/lib/util'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
// console.log('add');
const TaskDetail = ref({
  title: '',
  assignees: '',
  status: null,
  description: ''
})

const isTextOver = ref(false)
const statusName = ref('')
const store = useTaskStore()
const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const date = ref(new Date().toLocaleString('en-GB').replace('T', ' '))

const isInValid = ref(false)
const maxStatus = ref(false)
async function addNewTask() {
  store.resStatus = ''

  //Check if the status reached the limits
  for (const index in store.limitInfo) {
    if (TaskDetail.value.status === store.limitInfo[index].id && store.limitSwitch) {
      statusName.value = store.limitInfo[index].name
      return (maxStatus.value = true)
    }
  }

  if (!TaskDetail.value.title) {
    return (isInValid.value = true)
  } else {
    // console.log(TaskDetail.value);
    Object.assign(TaskDetail.value, {
      title: TaskDetail.value.title.trim(),
      assignees: !TaskDetail.value.assignees ? null : TaskDetail.value.assignees,
      status: TaskDetail.value.status ?? 1,
      description: !TaskDetail.value.description ? null : TaskDetail.value.description
    })
    // console.log(TaskDetail.value)
    // let addMethod function and send out info into the main page :D
    const result = await addMethod(TaskDetail.value, 'tasks')
    const findStatus = store.statusList.find((status) => status.id == result.data.status.id)
    Object.assign(findStatus, {
      noOfTasks: findStatus.noOfTasks + 1
    })
    
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

watch(
  [
    () => TaskDetail.value.title,
    () => TaskDetail.value.assignees,
    () => TaskDetail.value.description
  ],
  () => {
    if (TaskDetail.value.assignees != null && TaskDetail.value.description != null) {
      if (
        TaskDetail.value.title.length > 100 ||
        TaskDetail.value.assignees.length > 30 ||
        TaskDetail.value.description.length > 500
      ) {
        return (isTextOver.value = true)
      } else {
        return (isTextOver.value = false)
      }
    } else {
      TaskDetail.value.assignees = ''
      TaskDetail.value.description = ''
    }
  }
)

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
      class="itbkk-modal-task fixed w-[640px] h-auto bg-white flex flex-col gap-5 rounded-xl slide-in-fwd-center"
    >
      <div class="w-auto flex flex-row justify-between m-12 mb-0 font-bold">
        <div>Create New Task</div>
      </div>
      <div v-if="isInValid" class="kbd kbd-md mx-12 bg-red-300">invalid title required!!!!</div>
      <div class="overflow-y-auto h-full m-12 my-0">
        <label class="form-control w-full">
          <div
            class="label p-0 pb-[2px] font-semibold"
            :class="{ 'text-red-500': TaskDetail.title.length > 100 }"
          >
            ({{ TaskDetail.title.length }}/100)
            <div v-if="TaskDetail.title.length > 100">
              <p class="text-red-500">Title cannot be more than 100 characters.</p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Untitled"
            v-model="TaskDetail.title"
            :autofocus="!TaskDetail.title ? '' : (TaskDetail.title = TaskDetail.title.trimStart())"
            class="itbkk-title w-full h-auto text-2xl font-bold mb-4 break-words inline-block border border-none focus:border-transparent focus:outline-none"
          />
        </label>

        <div class="grid grid-cols-4 gap-y-2 text-md items-center">
          <span :class="header"> Status </span>
          <select
            class="itbkk-status text-base select select-bordered w-full max-w-xs p-0"
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
          <span :class="header" class="col-span-1">
            Assignees
            <span :class="{ 'text-red-500': TaskDetail.assignees.length > 30 }"
              >({{ TaskDetail.assignees.length }}/30)</span
            ></span
          >
          <label class="form-control w-full col-span-3">
            <div class="label p-0 pl-1 font-semibold">
              <div v-if="TaskDetail.assignees.length > 30">
                <p class="text-red-500">Assignees cannot be more than 30 characters.</p>
              </div>
            </div>
            <input
              type="test"
              v-model="TaskDetail.assignees"
              placeholder="Empty"
              class="itbkk-assignees w-full"
              :class="inputField"
            />
          </label>
        </div>

        <div class="w-full flex flex-col">
          <span :class="header" class="w-full divider divider-start mb-0"
            >Description<span :class="{ 'text-red-500': TaskDetail.description.length > 500 }"
              >({{ TaskDetail.description.length }}/500)</span
            >
          </span>

          <label class="form-control w-full">
            <div class="label pb-0 font-semibold">
              <p v-if="TaskDetail.description.length > 500" class="text-red-500">
                Description cannot be more than 500 characters.
              </p>
            </div>
            <textarea
              placeholder="Hi"
              v-model="TaskDetail.description"
              class="itbkk-description w-full max-h-48 min-h-48"
              :class="inputField"
            ></textarea>
          </label>
        </div>
      </div>

      <div class="right-0 m-12 my-10 mt-0 flex flex-col justify-center gap-2">
        <div v-if="maxStatus" class="text-red-400 text-center font-semibold">
          The status {{ statusName }} will have too many tasks. <br />
          Please make progress and updatestatus of existing tasks'
        </div>
        <!-- Enabled/Disabled State -->
        <div v-if="store.limitSwitch">
          <p class="text-center text-green-400"><b>Kaban board limits is enabled!</b></p>
        </div>
        <div v-else>
          <p class="text-center text-red-400"><b>Kaban board limits is disabled!</b></p>
        </div>
        <div class="flex justify-center gap-4">
          <button
            @click="addNewTask()"
            class="items-center itbkk-button-confirm btn bg-green-400"
            :disabled="!TaskDetail.title || isTextOver"
          >
            Save
          </button>
          <button
            @click="router.push({ name: 'task' })"
            class="items-center itbkk-button-cancel btn bg-grey-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
