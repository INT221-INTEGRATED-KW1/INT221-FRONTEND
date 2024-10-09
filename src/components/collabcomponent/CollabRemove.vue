<script setup>
import { useTaskStore } from '@/store/store'
import router from '@/router/router'
import { useRoute } from 'vue-router'
import { EnvelopeIcon, LockClosedIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { addMethod, deleteMethod } from '@/lib/fetchAPI'
const store = useTaskStore()
const route = useRoute()
const props = defineProps({
  currentItem: {
    type: Object,
    required: true
  }
})

async function removeCollabHandler() {
  const result = await deleteMethod(props.currentItem.oid, 'collabs')
  if (result.resCode == '200') {
    const resultIndex = store.collabList.findIndex((collab) => collab.oid == result.data.oid)
    store.collabList.splice(resultIndex, 1)
    store.ToastMessage.push({
      msg: 'Remove collaborator complete',
      color: 'green'
    })
  }
  let contextText = ''
  switch (result.resCode) {
    case 403:
      contextText = 'You do not have permission to remove collaborator.'
      break
    case 404:
      contextText = ` ${props.currentItem.name} is not a collaborator.`
      const index = store.collabList.findIndex((list) => list.oid == props.currentItem.oid)
      store.collabList.splice(index, 1)
      break
    default:
      contextText = 'There is a problem. Please try again later.'
  }
  if (![200].includes(result.resCode)) {
    store.ToastMessage.push({
      msg: contextText,
      color: 'red',
      erroricon: true
    })
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
      @click="router.push({ name: 'collab' })"
    ></div>
    <div
      name="modal"
      class="fixed w-auto h-auto p-8 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center justify-center"
    >
      <h1 class="w-full font-bold text-xl">Remove collaborator</h1>
      <!-- <p class="italic text-gray-500">Happiness is multiplies when you share it.</p> -->

      <p>Do you want to remove "{{ currentItem.name }}"</p>
      <div class="flex gap-2 justify-center">
        <button
          class="itbkk-button-cancel btn bg-green-300 hover:bg-green-400 hover:shadow-inner px-4 border-none"
          @click="removeCollabHandler()"
        >
          Remove
        </button>
        <button
          class="itbkk-button-cancel btn bg-slate-300 hover:bg-slate-400 hover:shadow-inner px-4 border-none"
          @click="router.push({ name: 'collab' })"
        >
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
