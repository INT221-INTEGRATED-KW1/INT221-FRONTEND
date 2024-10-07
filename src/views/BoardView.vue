<script setup>
import router from '@/router/router'
import { onMounted, ref } from 'vue'
import { useTaskStore } from '../store/store'
import { signOut } from '@/lib/util'
import { boardFetch, refreshToken } from '@/lib/fetchAPI'
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
const boardInfo = ref({})
const boardUser = localStorage.getItem('username')
const collabLength = ref(0)

async function loadBoard() {
  const result = await boardFetch()
  if (result.status === 401) {
    router.push({ name: 'login' })
  }
  store.boardList = result.data
  collabLength.value = result.data.collabBoards.length
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

function handleClick(id, bname) {
  localStorage.setItem('uid', id)
  localStorage.setItem('bname', bname)
  router.push({ name: 'task', params: { uid: id } })
}

onMounted(async () => {
  await loadBoard()
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

    <div class="relative overflow-x-auto shadow-md ">
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
        <tbody>
          <tr
            v-for="(boardCell, index) in store.boardList.personalBoards"
            @click="handleClick(boardCell.id, boardCell.name)"
            class="itbkk-item hover:cursor-pointer hover:bg-gray-300 hover:bg-opacity-20 transition duration-75 border-bottom"
          >
            <td class="px-6 py-4 font-extrabold text-center">{{ index + 1 }}</td>
            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
              {{ boardCell.name }}
            </th>
            <td class="px-6 py-4">{{ boardCell.visibility }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div name="Collab_Board" v-if="collabLength > 0">
    <h1>Callabs Board</h1>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg" >
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
        <tbody>
          <tr
            v-for="(boardCell, index) in store.boardList.collabBoards"
            @click="handleClick(boardCell.id, boardCell.name)"
            class="itbkk-item hover:cursor-pointer hover:bg-gray-300 hover:bg-opacity-20 transition duration-75 border-bottom"
          >
            <td class="px-6 py-4 font-extrabold text-center">{{ index + 1 }}</td>
            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
              {{ boardCell.name }}
            </th>
            <td class="px-6 py-4">{{ boardCell.owner.name }}</td>
            <td class="px-6 py-4">{{ boardCell.access_right }}</td>
            <td class="px-6 py-4"> Leave </td>
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
  </div>
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
