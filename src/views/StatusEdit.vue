<script setup>
import { updateMethod } from '@/lib/fetchAPI'
import { formatStatusReverse, onMountSetup, colorStatus, statusColors } from '@/lib/util'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { compile, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorModal from './ErrorModal.vue'
const route = useRoute()
const store = useTaskStore()
const id = router.currentRoute.value.params.id

const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const date = ref(new Date().toLocaleString('en-GB').replace('T', ' '))

const statusDetail = ref({})
let oldDetail = {}
const updateDetail = ref({})

onMounted(async () => {
  try {
    statusDetail.value = await onMountSetup('statuses')
    // store.errorRes = (await statusDetail.value.getMode) ?? 'Done'
    console.log(statusDetail.value.name)
    if (statusDetail.value.name == 'NO_STATUS') {
      router.push({ name: 'status' })
      store.ToastMessage = {
        msg: 'Cannot edit default status (NO_STATUS)',
        color: 'red',
        erroricon: true
      }
    }
    oldDetail = JSON.parse(JSON.stringify(statusDetail.value))
    updateDetail.value = statusDetail.value
    // console.log('a');
    store.isError = false
  } catch (error) {
    // console.log('err');
    store.ErrorMessage = 'An error has occurred, the status does not exist.'
    store.isError = true
    statusDetail.value = {}
    throw error
  }
})

const isInValid = ref(false)

const isSameDetail = computed(() => {
  return JSON.stringify(oldDetail) === JSON.stringify(updateDetail.value)
})

async function editStatus() {
  store.resStatus = ''
  isInValid.value = false
  if (isSameDetail.value) {
    // console.log('same');
    return router.push({ name: 'status' })
  }
  if (!updateDetail.value.name) {
    return (isInValid.value = true)
  } else {
    updateDetail.value = {
      id: updateDetail.value.id,
      name: updateDetail.value.name.trim(),
      description: updateDetail.value.description ?? null,
      color: updateDetail.value.color
    }
    // console.log(updateDetail.value);
    // let addtask function and send out info into the main page :D
    try {
      const result = await updateMethod(statusDetail.value.id, 'statuses', updateDetail.value)
      const index = store.statusList.findIndex((status) => status.id == result.data.id)
      Object.assign(store.statusList[index], result.data)
      const tasklist = store.taskList
      tasklist
        .filter((task) => task.status == oldDetail.name)
        .map((task) => (task.status = updateDetail.value.name))
      store.resStatus = 'editDone'
      router.push({ name: 'status' })
      store.ToastMessage = {
        msg: 'The status has been updated',
        color: 'lime'
      }
    } catch (error) {
      isInValid.value = true
      setTimeout(() => {
        isInValid.value = false
      }, 8000)
      store.resStatus = 'updateError'
      throw console.error('error : ', error)
    }
    router.push({ name: 'status' })
  }
}

const inputField = 'p-2 col-span-3 hover:bg-slate-400 hover:bg-opacity-20 duration-150 rounded-md'
const header = 'text-gray-900 text-opacity-50 font-semibold'
</script>
<template>
  <div
    v-if="Object.keys(statusDetail).length !== 0 && !store.isError"
    class="fixed top-0 z-[2] left-0 w-full h-full flex justify-center items-center font-sans text-md text-slate-900"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40"
      @click="router.push({ name: 'status' })"
    ></div>

    <div
      name="detail"
      class="fixed w-[640px] h-auto bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center text-black text-opacity-60 itbkk-modal-status"
    >
      <div class="w-auto flex flex-row justify-between m-12 mb-0 font-bold text-2xl">
        <div>Edit status</div>
      </div>
      <div v-if="isInValid" class="kbd kbd-md mx-12 bg-red-300">
        Status {{ updateDetail.name }} is already existed.
      </div>
      <div class="w-full my-4 flex justify-center items-center py-auto">
        <div
          class="rounded-md px-[8px] py-[2px] w-fit h-fit min-h-8 text-xl"
          :class="[colorStatus(updateDetail.color)]"
        >
          {{ !updateDetail.name ? 'Status' : updateDetail.name }}
        </div>
      </div>
      <div class="overflow-y-auto h-full m-12 my-0">
        <div class="w-full flex flex-col gap-2">
          <span class="w-full divider divider-start mb-0"><b>Name</b></span>
          <input
            type="text"
            placeholder="Unname"
            maxlength="50"
            v-model="updateDetail.name"
            class="itbkk-status-name w-full p-2 rounded-md hover:bg-gray-500 hover:bg-opacity-20"
          />
        </div>
        <div class="w-full flex flex-col gap-2">
          <span class="w-full divider divider-start mb-0"><b>Description</b></span>
          <textarea
            placeholder="Add some status ..."
            maxlength="50"
            v-model="updateDetail.description"
            class="itbkk-status-description w-full max-h-24 min-h-24 p-2 rounded-md hover:bg-gray-500 hover:bg-opacity-20"
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
              v-model="updateDetail.color"
              :value="colorName"
            />
            <div
              class="size-10 rounded-md py-auto ring-2 ring-transparent transition-all hover:shadow peer-checked:text-sky-600 peer-checked:ring-blue-400 peer-checked:ring-offset-2 text-center content-center"
              :class="[colorClass]"
            >
              <!-- {{ colorName }} -->
            </div>
          </label>
        </div>
      </div>

      <div class="mb-12 flex justify-center gap-4">
        <button
          @click="editStatus()"
          class="itbkk-button-confirm btn bg-green-400"
          :disabled="!updateDetail.name"
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
  <ErrorModal v-if="store.isError">
    <template #message>{{ store.ErrorMessage }}</template>
  </ErrorModal>
</template>
<style></style>
