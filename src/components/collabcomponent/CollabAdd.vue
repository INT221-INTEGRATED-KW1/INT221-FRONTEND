<script setup>
import { useTaskStore } from '@/store/store'
import router from '@/router/router'
import { useRoute } from 'vue-router'
import { EnvelopeIcon, LockClosedIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { addMethod, getMethod } from '@/lib/fetchAPI'
const store = useTaskStore()
const route = useRoute()
const newCollab = ref({
  email: '',
  access_right: 'READ'
})

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

const modalAlertText = ref('')
async function addCollabHandler() {
  const result = await addMethod(newCollab.value, 'collabs')
  if (result.resCode == '201') {
    store.collabList.push(result.data)
    store.ToastMessage.push({
      msg: 'Add collaborator complete',
      color: 'green'
    })
  } else {
    let contextText = ''
    switch (result.resCode) {
      case 400:
        contextText = 'In put type is not READ or WRITE'
        break
      case 403:
        contextText = 'You do not have permission to add board collaborator.'
        break
      case 404:
        modalAlertText.value = '🙅‍♂️ The user does not exists.'
        break
      case 409:
        modalAlertText.value = '🙅‍♂️ The user is already the collaborator of this board.'
        loadCollab()
        break
      default:
        contextText = 'There is a problem. Please try again later.'
    }
    console.log(result.resCode + ' : ' + contextText)
    if (![404, 409].includes(result.resCode)) {
      store.ToastMessage.push({
        msg: contextText,
        color: 'red',
        erroricon: true
      })
    } else {
      setTimeout(() => {
        modalAlertText.value = ''
      }, 5000)
    }
  }

  if (![404, 409].includes(result.resCode)) router.push({ name: 'collab' })
}
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-sm text-slate-900 itbkk-menu-status z-40"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40 itbkk-button"
      @click="router.push({ name: 'collab' })"
    ></div>
    <div
      name="modal"
      class="fixed w-auto h-auto p-8 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center justify-center"
    >
      <div>
        <h1 class="w-full font-bold text-xl">Add collaborator</h1>
        <p class="italic text-gray-500">Happiness is multiplies when you share it.</p>
      </div>

      <span
        v-show="modalAlertText"
        class="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded text-center"
        >{{ modalAlertText }}</span
      >

      <div class="flex gap-2 flex-col sm:flex-row">
        <div class="">
          <label for="collab-email" class="block mb-2 text-sm font-medium text-gray-900"
            >Collaborator Email</label
          >
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <EnvelopeIcon class="size-6" />
            </div>
            <input
              v-model="newCollab.email"
              type="email"
              id="collab-email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-11 p-2.5"
              placeholder="example@dosome.com"
              required
            />
          </div>
        </div>
        <div class="">
          <label for="collab-access" class="block mb-2 text-sm font-medium text-gray-900"
            >Access Right</label
          >
          <div class="relative">
            <select
              v-model="newCollab.access_right"
              id="collab-access"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            >
              <option disabled>select access type</option>
              <option value="READ" selected>📖 Read</option>
              <option value="WRITE">📝 Write</option>
            </select>
          </div>
        </div>
      </div>
      <div class="flex gap-2 justify-center">
        <button
          class="itbkk-button-cancel btn bg-green-300 hover:bg-green-400 hover:shadow-inner px-4 border-none"
          @click="addCollabHandler()"
          :disabled="!newCollab.email || !store.isOwnerBoard"
        >
          Add
        </button>
        <button
          class="itbkk-button-cancel btn bg-slate-300 hover:bg-slate-400 hover:shadow-inner px-4 border-none"
          @click="router.push({ name: 'collab' })"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
