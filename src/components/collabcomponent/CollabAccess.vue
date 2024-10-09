<script setup>
import { useTaskStore } from '@/store/store'
import router from '@/router/router'
import { patchMethod } from '@/lib/fetchAPI'
const store = useTaskStore()
const props = defineProps({
  currentItem: {
    type: Object,
    required: true
  }
})

async function changeAccessHandler() {
  const newAccess = { access_right: props.currentItem.accessRight }
  const result = await patchMethod('collabs', newAccess, props.currentItem.oid)
  if (result.resCode == '200') {
    const resultIndex = store.collabList.findIndex((collab) => collab.oid == result.data.oid)
    store.collabList[resultIndex] = result.data
    store.ToastMessage.push({
      msg: `Change ${result.data.name} collaborator to ${result.data.accessRight} complete`,
      color: 'green'
    })
  } else {
    let contextText = ''
    switch (result.resCode) {
      case 403:
        contextText = 'You do not have permission to change collaborator access right.'
        break
      default:
        contextText = 'There is a problem. Please try again later.'
    }
    store.ToastMessage.push({
      msg: contextText,
      color: 'red',
      erroricon: true
    })
  }

  router.push({ name: 'collab' })
}
// console.log(store.collabList.find((list) => list.oid == props.currentItem.oid))

function cancelHandler() {
  const index = store.collabList.findIndex((list) => list.oid == props.currentItem.oid)

  if (index > -1) {
    const access = store.collabList[index].accessRight == 'READ' ? 'WRITE' : 'READ'
    store.collabList[index].accessRight = access
  }
  router.push({ name: 'collab' })
}
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-sm text-slate-900 itbkk-menu-status z-40"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40 itbkk-button"
      @click="cancelHandler()"
    ></div>
    <div
      name="modal"
      class="fixed w-auto h-auto p-8 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center justify-center"
    >
      <h1 class="w-full font-bold text-xl">Remove collaborator</h1>
      <!-- <p class="italic text-gray-500">Happiness is multiplies when you share it.</p> -->

      <p>
        Do you want to change access right of "{{ currentItem.name }}" to "{{
          currentItem.accessRight
        }}"
      </p>
      <div class="flex gap-2 justify-center">
        <button
          class="itbkk-button-cancel btn bg-green-300 hover:bg-green-400 hover:shadow-inner px-4 border-none"
          @click="changeAccessHandler()"
        >
          Remove
        </button>
        <button
          class="itbkk-button-cancel btn bg-slate-300 hover:bg-slate-400 hover:shadow-inner px-4 border-none"
          @click="cancelHandler()"
        >
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
