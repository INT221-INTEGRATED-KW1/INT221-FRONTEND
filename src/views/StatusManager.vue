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
  ListBulletIcon,
  PencilSquareIcon,
  TrashIcon,
  PresentationChartBarIcon,
  ChatBubbleBottomCenterTextIcon
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
  if (result.resCode == '403') router.push({ name: 'forbidden' })
  if (result.resCode == '404') router.push({ name: 'notFound' })
  if (result.resCode == '200') {
    store.statusList = result.data
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
const fullName = ref(localStorage.getItem('username'))

onMounted(async () => {
  if (!store.statusList.length) {
    loadInfo()
  }
  fullName.value == null ? '' : store.checkIsOwnerBoard()
})
</script>

<template>
  <div
    class="w-full h-auto min-h-screen p-24 flex flex-col gap-4 font-sans text-slate-900 bg-white"
  >
    <div class="fixed top-4 right-4 flex flex-col gap-2">
      <button class="itbkk-fullname btn px-4 h-9 min-h-9 shadow-inner bg-lime-400 border-none">
        {{ fullName ?? 'Guest User' }}
      </button>
      <button
        v-if="store.isLogin"
        @click="signOut()"
        class="itbkk-fullname btn px-4 h-9 min-h-9 shadow-inner bg-red-600 border-none"
      >
        Sign Out
      </button>
      <button
        v-else
        @click="router.push({ name: 'login' })"
        class="itbkk-fullname btn px-4 h-9 min-h-9 hover:underline"
      >
        Sign in
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
        <span
          :title="
            !store.isEditable
              ? 'You need to be board owner or has write access to perform this action.'
              : ''
          "
        >
          <button
            @click="router.push({ name: 'addStatus' })"
            :disabled="!store.isEditable"
            class="itbkk-button-add btn px-4 h-9 min-h-9 bg-yellow-300 hover:bg-yellow-400 hover:border-yellow-400 border-none"
          >
            <SquaresPlusIcon class="size-6" />
            Add Status
          </button>
        </span>
      </div>
    </div>

    <div class="relative overflow-x-auto shadow-md">
      <table class="w-full text-sm text-left rtl:text-right text-gray-600">
        <thead class="text-sm uppercase bg-gray-400 text-gray-600 bg-opacity-20">
          <tr>
            <th scope="col" class="px-6 py-3">
              <span class="flex gap-1 items-center"
                ><ClipboardDocumentListIcon class="size-6" />id</span
              >
            </th>
            <th scope="col" class="px-6 py-3">
              <span class="flex gap-1 items-center"><UserCircleIcon class="size-6" />name</span>
            </th>
            <th scope="col" class="px-6 py-3">
              <span class="flex gap-1 items-center"
                ><ChatBubbleBottomCenterTextIcon class="size-6" />Description</span
              >
            </th>
            <th scope="col" class="px-6 py-3">
              <span class="flex gap-1 items-center"><FireIcon class="size-6" />Status</span>
            </th>
            <th scope="col" class="px-6 py-3">
              <span class="flex gap-1 items-center"
                ><PresentationChartBarIcon class="size-6" />usage</span
              >
            </th>
            <th scope="col" class="px-6 py-3">
              <span class="flex gap-1 items-center"><FireIcon class="size-6" />Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(status, index) in store.statusList"
            :key="status.id"
            class="itbkk-item hover:bg-gray-300 hover:bg-opacity-20 transition duration-75 border-bottom"
          >
            <td class="text-center px-6 py-4">{{ index + 1 }}</td>
            <td class="itbkk-status-name px-6 py-4 font-medium max-w-[18rem] min-w-52 break-words">
              {{ status.name }}
            </td>
            <td
              class="itbkk-status-description px-6 py-4 font-medium max-w-[18rem] min-w-52 break-words"
              :class="{ 'italic text-gray-500': !status.description }"
            >
              {{ status.description ?? 'No description is provided.' }}
            </td>
            <td class="px-6 py-4 max-w-[18rem] min-w-20 break-words">
              <div
                class="rounded-md px-[8px] py-[2px] w-fit max-w-[8rem] min-w-auto"
                :class="[colorStatus(status.color)]"
              >
                {{ status.name }}
              </div>
            </td>

            <td class="text-center">{{ status.noOfTasks }}</td>
            <td v-if="status.name != 'No Status' && status.name != 'Done'">
              <div class="flex gap-2 justify-center">
                <span
                  @click="router.push({ name: 'editStatus', params: { id: status.id } })"
                  class="itbkk-button-edit"
                  :title="
                    !store.isEditable
                      ? 'You need to be board owner or has write access to perform this action.'
                      : ''
                  "
                  ><PencilSquareIcon class="size-6 hover:scale-110 hover:text-orange-400" />
                </span>
                <span
                  @click="navToDeleteStatus(status)"
                  :title="
                    !store.isEditable
                      ? 'You need to be board owner or has write access to perform this action.'
                      : ''
                  "
                  class="itbkk-button-delete hover:scale-110 hover:text-red-500"
                  ><TrashIcon class="size-6" />
                </span>
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
