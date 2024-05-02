<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { deleteTask, getTask } from '../lib/fetchAPI'
import router from '@/router/router'
import { formatStatus } from '@/lib/util'
import { useRoute } from 'vue-router'
import {
  ClipboardDocumentListIcon,
  EllipsisVerticalIcon,
  FireIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'
import { colorStatus } from '@/lib/util'
import { useTaskStore, } from '@/store/store'


const store = useTaskStore()
const taskList = store.taskList
const route = useRoute()
const fetchTasks = async () => {
  try {
    const taskRes = await getTask('tasks')
    // taskList.value = taskRes.data
    // console.log(taskList.value);
    store.taskList.push(...taskRes.data)
    // console.log(store.taskList);
  } catch (error) {
    console.error('Error fetching tasks:', error.message)
  }
}
fetchTasks()
// const fetchInterval = setInterval(fetchTasks, 10000)
// onUnmounted(() => clearInterval(fetchInterval))

const isDeleting = ref(false)
const isComplete = ref(false)
const currentId = ref(0)
const currentTitle = ref('')
function showDeleteModal(id) {
  // console.log(id)
  currentId.value = id
  
  currentTitle.value = taskList[store.findTaskIndexById(id)].title
  // console.log(currentTitle.value)
  isDeleting.value = true
}
async function delTask(id) {
  isComplete.value = false
  const result = await deleteTask(id)
  console.log(result)
  if (result.resCode == '200') {
    console.log('done')
    isComplete.value = true
    taskList.splice(store.findTaskIndexById(id), 1)
  }
  isDeleting.value = false
}

const thead = ref(
  'h-full flex flex-row items-center gap-[4px] text-sm font-semibold text-black opacity-80'
)
</script>

<template>
  <div class="w-full h-screen p-24 flex flex-col gap-4 font-sans text-slate-900 bg-white">
    <div class="w-full h-28 font-bold text-4xl flex flex-col justify-center gap-1">
      <h1>IT-Bangmod Kradan Kanban</h1>
      <h2 class="text-3xl"></h2>
      <p class="text-base font-medium text-slate-700">Do something better than do nothing .</p>
    </div>
    <div role="alert" class="alert alert-success" v-if="isComplete">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Your task has been delete!</span>
    </div>
    <div class="w-full h-8 flex justify-end">
      <button @click="router.push('/task/add')" class="btn bg-sky-400">New...</button>
    </div>
    <div name="data" class="w-full flex flex-col justify-center items-center px-6">
      <table class="table">
        <thead class="border-b-[1px] border-opacity-10">
          <tr>
            <td class="w-3/5 border-r-[1px] border-opacity-10">
              <span :class="thead"
                ><ClipboardDocumentListIcon class="size-6" />
                <p>Title</p></span
              >
            </td>
            <td class="w-1/5 border-r-[1px] border-opacity-10">
              <span :class="thead"
                ><UserCircleIcon class="size-6" />
                <p>Assignees</p></span
              >
            </td>
            <td class="w-1/5">
              <span :class="thead"
                ><FireIcon class="size-6" />
                <p>Status</p></span
              >
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in taskList"
            :key="task.id"
            class="hover:cursor-pointer hover:bg-gray-300 hover:bg-opacity-20 transition duration-75 itbkk-item"
          >
            <td
              v-text="task.title"
              class="itbkk-title border-r-[1px] border-opacity-10"
              @click="router.push(`/task/${task.id}`)"
            ></td>
            <td
              :class="{ 'italic grey': !task.assignees, 'itbkk-assignees': !route.params.id }"
              class="border-r-[1px]"
            >
              {{ !task.assignees ? 'Unassigned' : task.assignees }}
            </td>
            <td>
              <div
                class="rounded-md px-[8px] py-[2px] w-fit itbkk-status"
                :class="colorStatus(task.status)"
              >
                {{ formatStatus(task.status) }}
              </div>
            </td>
            <td class="dropdown dropdown-bottom dropdown-end">
              <div tabindex="0" role="button" class="m-1">
                <EllipsisVerticalIcon class="size-6 hover:scale-150" />
              </div>
              <ul
                tabindex="0"
                class="dropdown-content z-0 menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li class=""><a @click="router.push(`/task/${task.id}/edit`)">Edit</a></li>
                <li class="text-red-500 hover:bg-red-300 rounded-lg">
                  <a @click="showDeleteModal(task.id)">Delete</a>
                </li>
              </ul>
            </td>
          </tr>

          <tr v-if="taskList.length == 0">
            <td col- class="text-center font-momo italic font-semibold text-opacity-70">No task</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div
    v-if="isDeleting"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-sm text-slate-900"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40 itbkk-button"
      @click="isDeleting = false"
    ></div>

    <div
      name="detail"
      class="fixed w-[640px] h-1/5 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center"
    >
      <h1>Deleting</h1>
      <p>Are you sure to delete task "{{ currentTitle }}" ?</p>
      <div>
        <button class="btn bg-green-400" @click="delTask(currentId)">Confirm</button>
        <button class="btn bg-slate-300" @click="isDeleting = false">Cancel</button>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
