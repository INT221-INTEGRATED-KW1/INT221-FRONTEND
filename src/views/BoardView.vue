<script setup>
import router from '@/router/router'
import { onMounted, ref } from 'vue'
import { useTaskStore } from '../store/store'
import { signOut } from '@/lib/util';

const url = import.meta.env.VITE_BASE_URL
const store = useTaskStore()
const boardName = ref('Name')
const boardInfo = ref({})
const boardUser = localStorage.getItem('username')

async function boardFetch() {
  try {
    const response = await fetch(`${url}boards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    const data = await response.json()
    boardInfo.value = data
    //temp
    // if (boardInfo.value.length === 1) {
    //   handleClick(boardInfo.value[0].id)
    // }
    if (!response.ok && data.status !== 401) {
      throw new Error(`Error: ${response.statusText}`)
    }
    if (data.status === 401) {
      router.push({name: 'login'})
    }
  } catch (error) {
    console.log(error)
    router.push({name: 'login'})
  }
}

async function boardPost() {
  try {
    const response = await fetch(`${url}boards`, {
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
    boardInfo.value.push(data)

    if (!response.ok && data.status !== 401) {
      throw new Error(`Error: ${response.statusText}`)
    } 
    if (data.status === 401) {
      router.push({name: 'login'})
    }
  } catch (error) {
    console.log(error)
    router.push({name: 'login'})
  }
}

function handleClick(id, bname) {
  localStorage.setItem('uid', id)
  localStorage.setItem('bname', bname)
  router.push({ name: 'task', params: { uid: id } })
}

onMounted(async () => {
  await boardFetch()
})
</script>

<template>
  <div class="navbar bg-base-100 glass shadow-2xl">
    <div class="flex-1">
      <a class="itbkk-home btn btn-outline text-xl" @click="router.push('/boards')">Home</a>
      <a class="itbkk-button-add btn btn-outline ml-2" onclick="createBoardModal.showModal()"
        >Create personal board</a
      >
      <a class="itbkk-sign-out btn btn-outline ml-2" @click="signOut()">Sign Out</a>
    </div>
    <div class="flex-none">
      <p class="itbkk-fullname">{{ boardUser }}</p>
    </div>
  </div>
  <br />
  <p class="text-4xl flex items-center justify-center w-full h-full">Board List</p>
  <div class="divider divider-neutral"></div>

  <div>
    <!-- Create board modal -->
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

    <div class="w-full h-auto min-h-screen p-24 flex flex-col overflow-x-auto">
      <table v-for="(boardCell, index) in boardInfo" class="table table-zebra">
        <thead>
          <tr>
            <th>No</th>
            <th>Board Name</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover" @click="handleClick(boardCell.id, boardCell.name)">
            <th>{{ index+1 }}</th>
            <th>{{ boardCell.name }}</th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="flex items-center justify-center w-full h-full"></div>
</template>
