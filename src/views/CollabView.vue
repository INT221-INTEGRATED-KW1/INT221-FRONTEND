<script setup>
import { getMethod } from '@/lib/fetchAPI'
import { signOut } from '@/lib/util'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import {
  ClipboardIcon,
  EyeIcon,
  FireIcon,
  GlobeAsiaAustraliaIcon,
  PencilSquareIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'
import ToastMessage from '@/components/ToastMessage.vue'

const isLoading = ref(true)
const store = useTaskStore()
async function loadCollab() {
  const result = await getMethod('collabs')
  if (result.resCode == '403') {
    return router.push({ name: 'forbidden' })
  }
  if (result.resCode == '404') {
    return router.push({ name: 'notFound' })
  }
  store.collabList = result.data
}

const boardUser = localStorage.getItem('username')

onMounted(async () => {
  await loadCollab()
  isLoading.value = false
})

const currentItem = ref({})
function removeCollabhandle(data) {
  currentItem.value = data
  router.push({ name: 'removeCollab' })
}

function changeAccessHandler(data) {
  currentItem.value = data
  router.push({ name: 'changeCollabAccess' })
}

const temp = {
  oid: '2b2f94fd7-cb35e139f6fb',
  name: 'ITBKK EEEEE',
  email: 'itbkk.eee@ad.sit.kmutt.ac.th',
  accessRight: 'WRITE',
  addedOn: '2024-10-07T15:21:01Z'
}
</script>

<template>
  <div
    class="w-full h-auto min-h-screen p-24 flex flex-col gap-4 font-sans text-slate-900 bg-white"
  >
    <div class="w-full font-bold text-4xl flex flex-col justify-center gap-1">
      <h1 class="" @click="store.collabList.push(temp)">IT-Bangmod Kradan Kanban</h1>
      <h2 class="text-3xl"></h2>
      <p class="text-base font-medium">Do something better than do nothing .</p>
    </div>

    <div class="fixed top-4 right-4 flex flex-col gap-2">
      <button class="itbkk-fullname btn px-4 h-9 min-h-9 shadow-inner bg-lime-400 border-none">
        {{ boardUser ?? 'Guest User' }}
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

    <div name="optionlist" class="w-full flex justify-between items-center">
      <div class="text-lg font-semibold breadcrumbs">
        <ul>
          <li
            class="hover:underline hover:cursor-pointer text-[#9c9c9c] itbkk-button-home"
            @click="router.push({ name: 'task' })"
          >
            Task
          </li>
          <li>Task Collab</li>
        </ul>
      </div>
      <div>
        <button
          @click="router.push({ name: 'addCollab' })"
          class="btn gap-1 px-2 h-9 min-h-9 bg-orange-200 hover:bg-orange-400 hover:border-green-400 border-none hover:shadow-inner"
        >
          <span>
            <PlusIcon class="size-6" />
          </span>
          <span class="text-base">Add collaborator</span>
        </button>
      </div>
    </div>

    <div class="relative overflow-x-auto shadow-md">
      <table class="w-full text-sm text-left rtl:text-right text-gray-600" v-if="store.collabList">
        <thead class="text-sm uppercase bg-gray-400 text-gray-600 bg-opacity-20">
          <tr>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center gap-1 justify-center">
                <GlobeAsiaAustraliaIcon class="size-6" />No
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center gap-1"><ClipboardIcon class="size-6" />Name</div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center gap-1"><EyeIcon class="size-6" />E-mail</div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center gap-1">
                <PencilSquareIcon class="size-6" />Access Right
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center gap-1"><FireIcon class="size-6" />Action</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(collab, index) in store.collabList"
            class="itbkk-item hover:cursor-pointer hover:bg-gray-300 hover:bg-opacity-20 transition duration-75 border-bottom"
          >
            <td class="px-6 py-4 font-extrabold text-center">{{ index + 1 }}</td>
            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
              {{ collab.name }}
            </th>
            <td class="px-6 py-4">{{ collab.email }}</td>
            <td class="px-6 py-4">
              <select
                id="collab-access"
                v-model="collab.accessRight"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                @change="changeAccessHandler(collab)"
              >
                <option disabled>select access type</option>
                <option value="READ" selected>📖 Read</option>
                <option value="WRITE">📝 Write</option>
              </select>
            </td>
            <td class="px-6 py-4">
              <span class="btn" @click="removeCollabhandle(collab)">remove</span>
            </td>
          </tr>
          <tr v-if="!store.collabList.length">
            <td colspan="5" class="text-center italic py-4">
              🕊️ No collaborator
              <span
                class="font-semibold hover:underline hover:cursor-pointer"
                @click="router.push({ name: 'addCollab' })"
                >Add New Collab
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ToastMessage></ToastMessage>
  <router-view :currentItem="currentItem" />
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
