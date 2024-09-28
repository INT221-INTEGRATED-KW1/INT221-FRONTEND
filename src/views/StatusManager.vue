<script setup>
import { onMounted, ref, watch } from 'vue'
import router from '@/router/router'
import { getMethod } from '../lib/fetchAPI'
import { colorStatus, onMountSetup, alertMessage, signOut } from '@/lib/util'
import {
  ClipboardDocumentListIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  FireIcon,
  PlusIcon,
  UserCircleIcon,
  CheckCircleIcon,
  FaceSmileIcon,
  SquaresPlusIcon,
  RocketLaunchIcon,
  ListBulletIcon
} from '@heroicons/vue/24/outline'
import { useTaskStore } from '@/store/store'
import ToastMessage from '../components/ToastMessage.vue'
const store = useTaskStore()
const statusList = store.statusList
function navToDeleteStatus(status) {
  store.currentItem = status
  router.push({
    name: 'deleteStatus',
    params: { id: status.id }
  })
}

async function loadInfo() {
  const result = await getMethod('statuses')
  if (result.resCode == '403') router.push({name: "forbidden"})
  if (result.resCode == '404') router.push({name: "notFound"})
  if (result.resCode == '200') {
    store.statusList.push(...result.data)
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

const thead = ref(
  'h-full flex flex-row items-center gap-[4px] text-sm font-semibold text-black opacity-80'
)

console.log()

onMounted(async () => {
  console.log(store.statusList);
  if (!store.statusList.length){console.log('a');
   loadInfo()}
    
})

const fullName = ref(localStorage.getItem('username'))
</script>

<template>
  <div
    class="w-full h-auto min-h-screen p-24 flex flex-col gap-4 font-sans text-slate-900 bg-white"
  >
  <div class="fixed top-4 right-4 flex flex-col gap-2">
      <button class="itbkk-fullname btn px-4 h-9 min-h-9 shadow-inner bg-lime-400 border-none">
        {{ fullName }}
      </button>
      <button
        @click="signOut()"
        class="itbkk-fullname btn px-4 h-9 min-h-9 shadow-inner bg-red-600 border-none"
      >
        Sign Out
      </button>
    </div>
    <div class="w-full h-28 font-bold text-4xl flex flex-col justify-center gap-1">
      <h1 class="">IT-Bangmod Kradan Kanban</h1>
      <h2 class="text-3xl"></h2>
      <p class="text-base font-medium">Do something better than do nothing .</p>
    </div>
    <div class="css-selector w-full h-1"></div>
    <div class="flex px-6">
      <div class="w-1/2 h-auto flex justify-start gap-4">
        <div class="text-sm breadcrumbs">
          <ul>
            <li
              class="hover:underline hover:cursor-pointer text-[#9c9c9c] itbkk-button-home"
              @click="router.push({ name: 'task' })"
            >
              Task
            </li>
            <li>Task Status</li>
          </ul>
        </div>
        <div></div>
      </div>
      <div class="w-1/2 h-auto flex justify-end gap-4">
        <button
          @click="router.push({ name: 'addStatus' })"
          class="itbkk-button-add btn px-4 h-9 min-h-9 bg-yellow-300 hover:bg-yellow-400 hover:border-yellow-400 border-none"
        >
          <SquaresPlusIcon class="size-6" />
          Add Status
        </button>
        <button
          @click="signOut()"
          class="itbkk-button-add btn px-4 h-9 min-h-9 bg-red-600 border-none"
        >
          Sign Out
        </button>
      </div>
    </div>
    <div
      name="data"
      class="w-full flex flex-col justify-center items-center px-6 bg-white rounded-2xl"
    >
      <table class="table rounded-3xl w-10/12">
        <thead class="border-b-[1px] border-opacity-10 bg-gray-600 bg-opacity-20">
          <tr>
            <td class="w-1/12 border-r-[1px] border-opacity-10 text-center">
              <span :class="thead" class="flex justify-center"> <p>Id</p></span>
            </td>
            <td class="w-3/12 border-r-[1px] border-opacity-10">
              <span :class="thead"
                ><ClipboardDocumentListIcon class="size-6" />
                <p>Name</p></span
              >
            </td>
            <td class="w-4/12 border-r-[1px] border-opacity-10">
              <span :class="thead"
                ><UserCircleIcon class="size-6" />
                <p>Description</p></span
              >
            </td>
            <td class="w-2/12 border-r-[1px] border-opacity-10">
              <span :class="thead"
                ><FireIcon class="size-6" />
                <p>Status</p></span
              >
            </td>
            <td class="w-1/12 border-r-[1px] border-opacity-10">
              <span :class="thead">
                <FaceSmileIcon class="size-6" />
                <p>Usage</p></span
              >
            </td>
            <td class="w-1/12 border-r-[1px] border-opacity-10">
              <span :class="thead"
                ><RocketLaunchIcon class="size-6" />
                <p>Action</p></span
              >
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(status, index) in store.statusList" :key="status.id" class="itbkk-item">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="itbkk-status-name">{{ status.name }}</td>
            <td
              class="itbkk-status-description"
              :class="{ 'italic text-gray-500': !status.description }"
            >
              {{ status.description ?? 'No description is provided.' }}
            </td>
            <td>
              <div class="rounded-md px-[8px] py-[2px] w-fit" :class="[colorStatus(status.color)]">
                {{ status.name }}
              </div>
            </td>

            <td class="text-center">{{ status.noOfTasks }}</td>
            <td
              v-if="status.name != 'No Status' && status.name != 'Done'"
              class="dropdown dropdown-bottom dropdown-end flex justify-center"
            >
              <div class="flex flex-row gap-2">
                <a
                  @click="router.push({ name: 'editStatus', params: { id: status.id } })"
                  class="itbkk-button-edit btn btn-sm"
                  >Edit</a
                >
                <a @click="navToDeleteStatus(status)" class="itbkk-button-delete btn btn-sm"
                  >Delete</a
                >
              </div>
            </td>
            <td v-else class="text-gray-500 italic text-center">default</td>
          </tr>
          <tr v-if="store.statusList.length == 0">
            <td colspan="4" class="text-center text-gray-600 italic">No Status</td>
            <td colspan="4" class="text-center text-gray-600 italic">Done</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ToastMessage></ToastMessage>
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
