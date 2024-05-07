<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { deleteTask, getTask } from '../lib/fetchAPI'
import router from '@/router/router'
import { formatStatus, colorStatus } from '@/lib/util'
import { useRoute } from 'vue-router'
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  EllipsisVerticalIcon,
  FireIcon,
  PlusIcon,
  UserCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useTaskStore } from '@/store/store'
import ErrorModal from '@/views/ErrorModal.vue'
const store = useTaskStore()
const taskList = store.taskList
const route = useRoute()
const fetchTasks = async () => {
  try {
    store.resStatus
    const taskRes = await getTask('tasks')
    store.taskList.push(...taskRes.data)
    // console.log(store.taskList);
  } catch (error) {
    console.error('Error fetching tasks:', error.message)
  }
}
fetchTasks()

const isDeleting = ref(false)
const isComplete = ref(false)
const currentId = ref(0)
const currentTask = ref('')
function showDeleteModal(id) {
  currentId.value = id
  currentTask.value = taskList[store.findTaskIndexById(id)]
  isDeleting.value = true
  store.errorRes = 'Done'
}
async function delTask(id) {
  isComplete.value = false
  try {
    const result = await deleteTask(id)
    // console.log(result.resCode)
    store.resStatus = 'deleteDone'
    // console.log(store.errorRes)
  } catch (error) {
    store.resStatus = 'deleteError'
    store.errorRes = 'delete'
    // console.log(store.errorRes)
  }
  isDeleting.value = false
  taskList.splice(store.findTaskIndexById(id), 1)
}

const thead = ref(
  'h-full flex flex-row items-center gap-[4px] text-sm font-semibold text-black opacity-80'
)

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

const msg = ref({})
watch(
  () => store.resStatus,
  (newStatus) => {
    msg.value = alertMessage(newStatus)
    if (newStatus) {
      setTimeout(() => {
        store.resStatus = ''
        msg.value = {}
      }, 5000)
    }
  }
)
</script>

<template>
  <div
    class="w-full h-auto min-h-screen p-24 flex flex-col gap-4 font-sans text-slate-900 bg-white"
  >
    <div class="w-full h-28 font-bold text-4xl flex flex-col justify-center gap-1">
      <h1>IT-Bangmod Kradan Kanban</h1>
      <h2 class="text-3xl"></h2>
      <p class="text-base font-medium text-slate-700">Do something better than do nothing .</p>
    </div>

    <div class="w-full h-auto flex justify-end">
      <button
        @click="router.push('/task/add')"
        class="itbkk-button-add btn px-4 h-9 min-h-9 bg-sky-300 hover:bg-sky-400 hover:border-sky-400"
      >
        <PlusIcon class="size-6"></PlusIcon>
        Add
      </button>
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
              :class="{
                'itbkk-title': !route.params.id
              }"
              @click="router.push(`/task/${task.id}`)"
            ></td>
            <td
              :class="{
                'italic text-gray-500': !task.assignees,
                'itbkk-assignees': !route.params.id
              }"
              class="border-r-[1px]"
            >
              {{ !task.assignees ? 'Unassigned' : task.assignees }}
            </td>
            <td>
              <div
                class="rounded-md px-[8px] py-[2px] w-fit itbkk-status"
                :class="[colorStatus(task.status), { 'itbkk-assignees': !route.params.id }]"
              >
                {{ formatStatus(task.status) }}
              </div>
            </td>
            <td class="dropdown dropdown-bottom dropdown-end">
              <div tabindex="0" role="button" class="m-1">
                <EllipsisVerticalIcon class="itbkk-button-action size-6 hover:scale-150" />
              </div>
              <ul
                tabindex="0"
                class="dropdown-content z-0 menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li class="">
                  <a @click="router.push(`/task/${task.id}/edit`)" class="itbkk-button-edit"
                    >Edit</a
                  >
                </li>
                <li class="text-red-500 hover:bg-red-300 bg-red-300 rounded-lg">
                  <a @click="showDeleteModal(task.id)" class="itbkk-button-delete">Delete</a>
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

  <!-- SOME THING HAPPEn -->
  <transition name="alert">
    <div class="fixed top-4 w-full" v-if="store.resStatus != ''">
      <div role="alert" class="w-fit mx-auto" :class="msg.css">
        <CheckCircleIcon class="size-8"></CheckCircleIcon>
        <span class="itbkk-message">{{ msg.message }}</span>
        <!-- <XMarkIcon class="size-8 hover:scale-125" @click="store.resStatus = ''"></XMarkIcon> -->
      </div>
    </div>
  </transition>

  <div
    v-if="isDeleting && store.errorRes == 'Done'"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-sm text-slate-900"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40 itbkk-button"
      @click="isDeleting = false"
    ></div>
    <transition>
      <div
        name="detail"
        class="fixed w-[640px] h-auto p-8 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center justify-center"
      >
        <img src="/public/folder.png" alt="" class="size-24 mx-auto" />
        <h1 class="w-full text-center font-semibold text-xl">Deleting</h1>
        <p class="itbkk-message w-full text-center text-lg break-words inline-block">
          Do you want to delete the task number {{ currentTask.id }}
          <span v-text="currentTask.title"></span> ?
        </p>
        <div class="w-full flex flex-row gap-4 justify-center items-center mt-4">
          <button class="itbkk-button-confirm btn bg-green-400" @click="delTask(currentId)">
            Confirm
          </button>
          <button class="itbkk-button-cancel btn bg-slate-300" @click="isDeleting = false">
            Cancel
          </button>
        </div>
      </div>
    </transition>
  </div>
  <ErrorModal v-if="store.errorRes != 'Done'"></ErrorModal>
  <router-view v-slot="{ Component }">
    <transition>
      <component :is="Component" />
    </transition>
  </router-view>
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

.slide-bottom {
  animation: slide-bottom 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}

.alert-enter-active,
.alert-leave-active {
  animation: slide-bottom 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}

.alert-enter,
.alert-leave-to {
  animation: slide-top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}

@keyframes slide-bottom {
  0% {
    transform: translateY(-100px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes slide-top {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100px);
  }
}
</style>
