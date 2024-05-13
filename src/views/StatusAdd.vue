<script setup>
import { addMethod } from '@/lib/fetchAPI'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { ref } from 'vue'
import { colorStatus, statusColors } from '@/lib/util'
// console.log('aaa')
const StatusDetail = ref({
  name: null,
  description: null,
  color: null
})

const store = useTaskStore()

const isInValid = ref(false)

async function addNewStatus() {
  store.resStatus = ''
  isInValid.value = false
  if (!StatusDetail.value.name) {
    return (isInValid.value = true)
  } else {
    Object.assign(StatusDetail.value, {
      name: StatusDetail.value.name.trim(),
      description: !StatusDetail.value.description ? null : StatusDetail.value.description.trim(),
      color: StatusDetail.value.color ?? 'grey'
    })
    // let addtask function and send out info into the main page :D
    try {
      const result = await addMethod(StatusDetail.value, 'statuses')
      // console.log(StatusDetail.value)
      // console.log(store.statusList)
      store.statusList.push(result.data)
      store.resStatus = 'addDone'
      router.push({ name: 'status' })
      store.ToastMessage = {
        msg: 'The status has been added',
        color: 'green'
      }
    } catch (error) {
      isInValid.value = true
      setTimeout(() => {
        isInValid.value = false
      }, 8000)
      console.error('fail to post : ', error)
    }
  }
}
const inputField = 'p-2 col-span-3 hover:bg-slate-400 hover:bg-opacity-20 duration-150 rounded-md'
const header = 'text-gray-900 text-opacity-50 font-semibold'
</script>

<template>
  <div
    class="fixed top-0 z-[2] left-0 w-full h-full flex justify-center items-center font-sans text-md text-slate-900 itbkk-modal-status"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40"
      @click="router.push({ name: 'status' })"
    ></div>

    <div
      name="detail"
      class="fixed w-[640px] h-auto bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center"
    >
      <div class="w-auto flex flex-row justify-between m-12 mb-0 font-bold text-2xl">
        <div>Create new status</div>
      </div>
      <div v-if="isInValid" class="kbd kbd-md mx-12 bg-red-300">
        Status {{ StatusDetail.name }} is already existed.
      </div>
      <div class="w-full my-4 flex justify-center items-center py-auto">
        <div
          class="rounded-md px-[8px] py-[2px] w-fit h-fit min-h-8 text-xl"
          :class="[colorStatus(StatusDetail.color)]"
        >
          {{ !StatusDetail.name ? 'Status' : StatusDetail.name }}
        </div>
      </div>
      <div class="overflow-y-auto h-full m-12 my-0">
        <div class="w-full flex flex-col gap-2">
          <span class="w-full divider divider-start mb-0"><b>Name</b></span>
          <input
            type="text"
            placeholder="Untitle"
            maxlength="50"
            v-model="StatusDetail.name"
            class="itbkk-status-name w-full p-2 rounded-md hover:bg-gray-500 hover:bg-opacity-20"
          />
        </div>
        <div class="w-full flex flex-col gap-2">
          <span class="w-full divider divider-start mb-0"><b>Description</b></span>
          <textarea
            placeholder="Add some status ..."
            maxlength="200"
            v-model="StatusDetail.description"
            class="itbkk-status-description w-full max-h-28 min-h-28 p-2 rounded-md hover:bg-gray-500 hover:bg-opacity-20"
          ></textarea>
        </div>
        <span class="w-full divider divider-start mb-0"><b>Color</b></span>
        <div class="grid grid-cols-8 wrap gap-4 m-6 place-items-center">
          <label
            v-for="(colorClass, colorName) in statusColors"
            :key="colorName"
            class="cursor-pointer pr-0"
          >
            <input
              type="radio"
              class="peer sr-only"
              name="color"
              v-model="StatusDetail.color"
              :value="colorName"
            />
            <div
              class="size-10 rounded-md py-auto ring-2 ring-transparent transition-all hover:shadow peer-checked:text-sky-600 peer-checked:ring-blue-400 peer-checked:ring-offset-2 text-center content-center"
              :class="[colorClass]"
            ></div>
          </label>
        </div>
      </div>

      <div class="mb-12 flex justify-center gap-4">
        <button
          @click="addNewStatus()"
          class="itbkk-button-confirm btn bg-green-400"
          :disabled="!StatusDetail.name"
        >
          Save
        </button>
        <button @click="router.push({name: 'status'})" class="itbkk-button-cancel btn bg-grey-400">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
