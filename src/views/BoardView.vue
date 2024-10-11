<script setup>
import router from '@/router/router'
import { onMounted, ref } from 'vue'
import { useTaskStore } from '../store/store'
import { signOut } from '@/lib/util'
import { boardFetch, deleteMethod, refreshToken } from '@/lib/fetchAPI'
import ToastMessage from '@/components/ToastMessage.vue'
import {
  ClipboardIcon,
  DocumentIcon,
  EyeDropperIcon,
  EyeIcon,
  FaceSmileIcon,
  GlobeAsiaAustraliaIcon,
  PencilSquareIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const SERVER_URL = import.meta.env.VITE_BASE_URL
const VERSION = 'v3'
const url = `${SERVER_URL}/${VERSION}`

const store = useTaskStore()
const boardName = ref('Name')
const boardUser = localStorage.getItem('username')
const isLoading = ref(true)
async function loadBoard() {
  const result = await boardFetch()
  if (result.status === 401) {
    router.push({ name: 'login' })
  }
  store.boardList = result.data
}

async function boardPost() {
  const response = await fetch(`${url}/boards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({
      name: boardName.value
    })
  })

  const data = await response.json()
  store.boardList.personalBoards.push(data)

  if (!response.ok && data.status !== 401) {
    throw new Error(`Error: ${response.statusText}`)
  }
  if (data.status === 401) {
    await refreshToken()
  }
}

const currentItem = ref()
async function leaveCollab() {
  const response = await fetch(
    `${url}/boards/${currentItem.value.id}/collabs/${localStorage.getItem('oid')}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
  )
  const result = { resCode: response.status, data: await response.json() }

  switch (result.resCode) {
    case 200:
      const index = store.boardList.collabBoards.findIndex((list) => list.id == currentItem.value.id)
      store.boardList.collabBoards.splice(index, 1)
      store.ToastMessage.push({
        msg: 'Leave complete',
        color: 'orange'
      })
      console.log('a')
      router.push({ name: 'board' })
      break
    default:
      store.ToastMessage.push({
        msg: 'There is a problem. Please try again later.',
        color: 'red',
        erroricon: true
      })
      console.log('b')
  }
  // console.log(store.boardList.collabBoards);
  
}

function handleClick(id, bname) {
  localStorage.setItem('uid', id)
  localStorage.setItem('bname', bname)
  router.push({ name: 'task', params: { uid: id } })
}

function handleLeaveClick(item) {
  currentItem.value = item
  leaveCollabModal.showModal()
}

onMounted(async () => {
  await loadBoard()
  isLoading.value = false
})
</script>

<template>
  <div
    class="w-full h-auto min-h-screen p-24 flex flex-col gap-4 font-sans text-slate-900 bg-white"
  >
    <div class="w-full font-bold text-4xl flex flex-col justify-center gap-1">
      <h1 class="">IT-Bangmod Kradan Kanban</h1>
      <h2 class="text-3xl"></h2>
      <p class="text-base font-medium">Do something better than do nothing .</p>
    </div>

    <div class="fixed top-4 right-4 flex flex-col gap-2">
      <button class="itbkk-fullname btn px-4 h-9 min-h-9 shadow-inner bg-lime-400 border-none">
        {{ boardUser }}
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

    <div class="css-selector w-full h-1"></div>

    <div name="optionlist" class="w-full items-center">
      <button
        onclick="createBoardModal.showModal()"
        class="itbkk-status-setting btn px-2 h-9 min-h-9 bg-green-200 hover:bg-green-400 hover:border-green-400 border-none hover:shadow-inner"
      >
        <span>
          <PlusIcon class="size-6" />
        </span>
        <span class="font-semibold text-lg">Create board</span>
      </button>
    </div>

    <div class="relative overflow-x-auto shadow-md">
      <table class="w-full text-sm text-left rtl:text-right text-gray-600">
        <thead class="text-sm uppercase bg-gray-400 text-gray-600 bg-opacity-20">
          <tr>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center gap-1 justify-center">
                <GlobeAsiaAustraliaIcon class="size-6" />No
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center gap-1"><ClipboardIcon class="size-6" />BoardName</div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center gap-1"><EyeIcon class="size-6" />visibility</div>
            </th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <tr
            v-for="(boardCell, index) in store.boardList.personalBoards"
            @click="handleClick(boardCell.id, boardCell.name)"
            class="itbkk-item hover:cursor-pointer hover:bg-gray-300 hover:bg-opacity-20 transition duration-75 border-bottom"
          >
            <td class="px-6 py-4 font-extrabold text-center">{{ index + 1 }}</td>
            <td scope="row" class="px-6 py-4 max-w-[18rem] min-w-52 break-words font-medium">
              {{ boardCell.name }}
            </td>
            <td class="px-6 py-4 uppercase">{{ boardCell.visibility.toLowerCase() == "private" ?  '🕵 private': '🌏 public'}}</td>
          </tr>
          <tr v-if="!store.boardList.personalBoards.length">
            <td colspan="5" class="text-center italic py-4">
              🕊️ No Board
              <span
                class="font-semibold hover:underline hover:cursor-pointer"
                onclick="createBoardModal.showModal()"
                >Create New Board
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div name="Collab_Board" v-if="store.collabList">
      <h1 class="text-gray-600 text-xl font-bold pb-2">Callabs Board</h1>
      <div class="relative overflow-x-auto shadow-md">
        <table class="w-full text-sm text-left rtl:text-right text-gray-600">
          <thead class="text-sm uppercase bg-gray-400 text-gray-600 bg-opacity-20">
            <tr>
              <th scope="col" class="py-3">
                <div class="flex items-center gap-1 justify-center">
                  <GlobeAsiaAustraliaIcon class="size-6" />No
                </div>
              </th>
              <th scope="col" class="py-3">
                <div class="flex items-center gap-1"><ClipboardIcon class="size-6" />BoardName</div>
              </th>
              <th scope="col" class="py-3">
                <div class="flex items-center gap-1"><EyeIcon class="size-6" />Owner</div>
              </th>
              <th scope="col" class="py-3">
                <div class="flex items-center gap-1">
                  <PencilSquareIcon class="size-6" />Access right
                </div>
              </th>
              <th scope="col" class="py-3">
                <div class="flex items-center gap-1"><FaceSmileIcon class="size-6" />Action</div>
              </th>
            </tr>
          </thead>
          <tbody v-if="!isLoading">
            <tr
              v-for="(boardCell, index) in store.boardList.collabBoards"
              class="itbkk-item hover:cursor-pointer hover:bg-gray-300 hover:bg-opacity-20 transition duration-75 border-bottom"
            >
              <td
                class="px-6 py-4 font-extrabold text-center"
                @click="handleClick(boardCell.id, boardCell.name)"
              >
                {{ index + 1 }}
              </td>
              <th
                scope="row"
                class="px-6 py-4 font-medium whitespace-nowrap"
                @click="handleClick(boardCell.id, boardCell.name)"
              >
                {{ boardCell.name }}
              </th>
              <td class="px-6 py-4" @click="handleClick(boardCell.id, boardCell.name)">
                {{ boardCell.owner.name }}
              </td>
              <td class="px-6 py-4" @click="handleClick(boardCell.id, boardCell.name)">
                {{ boardCell.access_right == "READ" ? "📖 Read" : "📝 Write" }}
              </td>
              <td class="px-6 py-4">
                <span class="btn" @click="handleLeaveClick(boardCell)">Leave</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <dialog id="createBoardModal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">New Board</h3>
        <p class="py-4">Name</p>
        <input
          maxlength="120"
          type="text"
          value="Name"
          v-model="boardName"
          class="itbkk-board-name input input-bordered input-sm w-full"
        />
        <div class="modal-action">
          <form method="dialog">
            <button
              class="itbkk-button-ok btn mr-2 btn-outline"
              :disabled="!boardName"
              @click="boardPost()"
            >
              Save
            </button>
            <button class="itbkk-button-cancel btn btn-outline">Close</button>
          </form>
        </div>
      </div>
    </dialog>

    <dialog id="leaveCollabModal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Leave Board</h3>
        <p class="py-4">Do you want to leave this "{{ currentItem?.name }}" board ?</p>
        <div class="modal-action">
          <form method="dialog">
            <button class="itbkk-button-ok btn mr-2 btn-outline" @click="leaveCollab()">
              Confirm
            </button>
            <button class="itbkk-button-cancel btn btn-outline">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
  <ToastMessage></ToastMessage>
</template>

<style scoped>
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

.border-bottom:not(:last-child) {
  border-bottom: 1px solid rgba(196, 200, 209, 0.5);
}
</style>
