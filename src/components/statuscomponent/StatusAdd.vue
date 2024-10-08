<script setup>
import { addMethod } from '@/lib/fetchAPI'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { ref, watch } from 'vue'
import { colorStatus, statusColors } from '@/lib/util'
const StatusDetail = ref({
  name: '',
  description: '',
  color: null
})

const store = useTaskStore()
const isTextOver = ref(false)
const isInValid = ref(false)

async function addNewStatus() {
  store.resStatus = ''
  isInValid.value = false
  if (!StatusDetail.value.name) {
    return (isInValid.value = true)
  }

  Object.assign(StatusDetail.value, {
    name: StatusDetail.value.name.trim(),
    description: !StatusDetail.value.description ? null : StatusDetail.value.description,
    color: StatusDetail.value.color ?? 'grey'
  })
  // let addtask function and send out info into the main page :D

  const result = await addMethod(StatusDetail.value, 'statuses')
  if (result.resCode != '201') {
    isInValid.value = true
    setTimeout(() => {
      isInValid.value = false
    }, 8000)
  } else {
    store.statusList.push(result.data)
    store.resStatus = 'addDone'
    router.push({ name: 'status' })
    store.ToastMessage.push({
      msg: 'The status has been added',
      color: 'green'
    })
  }
}

watch([() => StatusDetail.value.name, () => StatusDetail.value.description], () => {
  if (StatusDetail.value.description != null) {
    if (StatusDetail.value.name.length > 50 || StatusDetail.value.description.length > 200) {
      return (isTextOver.value = true)
    } else {
      return (isTextOver.value = false)
    }
  } else {
    StatusDetail.value.description = ''
  }
})

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
          <span class="w-full divider divider-start mb-0 font-semibold"
            >Name<span :class="{ 'text-red-500': StatusDetail.name.length > 50 }">
              ({{ StatusDetail.name.length }}/50)</span
            ></span
          >
          <label class="form-control w-full">
            <div class="label p-0 pb-[2px] font-semibold">
              <div v-if="StatusDetail.name.length > 50">
                <p class="text-red-500 pl-2">Name cannot be more than 50 characters.</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Unname"
              v-model="StatusDetail.name"
              class="itbkk-status-name w-full p-2 rounded-md hover:bg-gray-500 hover:bg-opacity-20"
            />
          </label>
        </div>
        <div class="w-full flex flex-col gap-2">
          <span class="w-full divider divider-start mb-0 font-semibold"
            >Description<b
              class="font-semibold"
              :class="{ 'text-red-500': StatusDetail.description.length > 200 }"
            >
              ({{ StatusDetail.description.length }}/200)</b
            ></span
          >

          <label class="form-control w-full">
            <div class="label p-0 pb-[2px] font-semibold">
              <div v-if="StatusDetail.description.length > 200">
                <p class="text-red-500 pl-2">Description cannot be more than 200 characters.</p>
              </div>
            </div>
            <textarea
              placeholder="Add some status ..."
              v-model="StatusDetail.description"
              class="itbkk-status-description w-full max-h-28 min-h-28 p-2 rounded-md hover:bg-gray-500 hover:bg-opacity-20"
            ></textarea>
          </label>
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
          :disabled="!StatusDetail.name || isTextOver"
        >
          Save
        </button>
        <button
          @click="router.push({ name: 'status' })"
          class="itbkk-button-cancel btn bg-grey-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
