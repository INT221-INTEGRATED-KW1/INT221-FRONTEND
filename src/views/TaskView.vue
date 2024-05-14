<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { deleteMethod, getMethod } from '../lib/fetchAPI'
import router from '@/router/router'
import { formatStatus, colorStatus, alertMessage } from '@/lib/util'
import { useRoute } from 'vue-router'
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  EllipsisVerticalIcon,
  FireIcon,
  PlusIcon,
  Squares2X2Icon,
  UserCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useTaskStore } from '@/store/store'
import ErrorModal from '@/views/ErrorModal.vue'
import ToastMessage from '@/views/ToastMessage.vue'
const store = useTaskStore()
const taskList = store.taskList
const route = useRoute()
const statusList = ref(store.statusList)

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
  let result
  try {
    result = await deleteMethod(id, 'tasks')
    store.resStatus = 'deleteDone'
    store.ToastMessage = {
      msg: 'The task has been deleted',
      color: 'green'
    }
  } catch (error) {
    store.resStatus = 'deleteError'
    store.errorRes = 'delete'
  }
  isDeleting.value = false
  taskList.splice(store.findTaskIndexById(id), 1)
  // console.log(result.data)
  // console.log(store.statusList[result.data.status.id -1])
  store.statusList[result.data.status.id -1].countTask = store.statusList[result.data.status.id -1].countTask - 1 
}

const thead = ref(
  'h-full flex flex-row items-center gap-[4px] text-sm font-semibold text-black opacity-80'
)

function matchColor(statusName) {
  const result = store.statusList.find((status) => status.name == statusName) ?? 'grey'
  const color = colorStatus(result.color)
  return color
}
</script>

<template>
  <div
    class="w-full h-auto min-h-screen p-24 flex flex-col gap-4 font-sans text-slate-900 bg-white"
  >
    <div class="w-full h-28 font-bold text-4xl flex flex-col justify-center gap-1">
      <h1 class="">IT-Bangmod Kradan Kanban</h1>
      <h2 class="text-3xl"></h2>
      <p class="text-base font-medium">Do something better than do nothing .</p>
    </div>
    <div class="css-selector w-full h-1"></div>
    <div class="w-full h-auto flex justify-end gap-4 px-6">
      <button
        @click="router.push({ name: 'addTask' })"
        class="itbkk-button-add btn px-4 h-9 min-h-9 bg-sky-300 hover:bg-sky-400 hover:border-sky-400 border-none"
      >
        <PlusIcon class="size-6"></PlusIcon>
        Add
      </button>

      <button
        @click="router.push({ name: 'status' })"
        class="itbkk-manage-status btn px-4 h-9 min-h-9 bg-yellow-300 hover:bg-yellow-400 hover:border-yellow-400 border-none"
      >
        <span :class="thead"
          ><Squares2X2Icon class="size-6" />
          <p>Status M.</p></span
        >
      </button>
    </div>
    <div
      name="data"
      class="w-full flex flex-col justify-center items-center px-6 bg-white rounded-2xl"
    >
      <table class="table rounded-3xl w-auto">
        <thead class="border-b-[1px] border-opacity-10 bg-gray-600 bg-opacity-20">
          <tr>
            <td class="w-3/5 border-r-[1px] border-opacity-10">
              <span :class="thead">
                <ClipboardDocumentListIcon class="size-6" />
                <p>Title</p>
              </span>
            </td>
            <td class="w-1/5 border-r-[1px] border-opacity-10">
              <span :class="thead">
                <UserCircleIcon class="size-6" />
                <p>Assignees</p>
              </span>
            </td>
            <td class="w-1/5">
              <span :class="thead">
                <FireIcon class="size-6" />
                <p>Status</p>
              </span>
            </td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in taskList"
            :key="task.id"
            class="hover:cursor-pointer hover:bg-gray-300 hover:bg-opacity-20 transition duration-75 itbkk-item"
          >
            <td
              class="itbkk-title border-r-[1px] border-opacity-10 whitespace-normal"
              :class="{ 'itbkk-title': !route.params.id }"
              @click="router.push({ name: 'taskDetail', params: { id: task.id } })"
            >
              {{ task.title }}
            </td>
            <td
              :class="{
                'italic text-gray-500': !task.assignees,
                'itbkk-assignees': !route.params.id
              }"
              class="border-r-[1px] whitespace-normal"
            >
              {{ !task.assignees ? 'Unassigned' : task.assignees }}
            </td>
            <td class="w-1/6">
              <div
                class="rounded-md px-[8px] py-[2px] w-fit"
                :class="[matchColor(task.status.name), { 'itbkk-status': !route.params.id }]"
              >
                {{ task.status.name }}
              </div>
            </td>
            <td class="dropdown dropdown-bottom dropdown-end">
              <div tabindex="0" role="button" class="m-1">
                <EllipsisVerticalIcon class="itbkk-button-action size-6 hover:scale-150" />
              </div>
              <ul
                tabindex="0"
                class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li class="">
                  <a
                    @click="router.push({ name: 'editTask', params: { id: task.id } })"
                    class="itbkk-button-edit"
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
            <td
              colspan="4"
              class="text-center font-momo italic font-semibold text-opacity-70 whitespace-normal"
            >
              No task
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ToastMessage></ToastMessage>

  <div
    v-if="isDeleting && store.errorRes == 'Done'"
    class="fixed top-0 z-[1] left-0 w-full h-full flex justify-center items-center font-sans text-sm text-slate-900"
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
        <img src="/public/trash-can.png" alt="" class="size-24 mx-auto" />
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
  <router-view />
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

.css-selector {
  background: linear-gradient(
    180deg,
    #b90000,
    #ff3535,
    #fffb35,
    #6cff35,
    #35ffc2,
    #35a4ff,
    #4b35ff
  );
  background-size: 1400% 1400%;
  -webkit-animation: AnimationName 30s ease infinite;
  -moz-animation: AnimationName 30s ease infinite;
  animation: AnimationName 10s ease infinite;
}

@-webkit-keyframes AnimationName {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 51% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
}
@-moz-keyframes AnimationName {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 51% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
}
@keyframes AnimationName {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 51% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
}
</style>
