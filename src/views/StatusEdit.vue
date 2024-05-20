<script setup>
import { updateMethod } from '@/lib/fetchAPI'
import { formatStatusReverse, onMountSetup, colorStatus, statusColors } from '@/lib/util'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { computed, onMounted, ref, watch } from 'vue'
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

const isTextOver = ref(false)

onMounted(async () => {
  try {
    statusDetail.value = await onMountSetup('statuses')
    // store.errorRes = (await statusDetail.value.getMode) ?? 'Done'
    // console.log(statusDetail.value.name)

    Object.assign(statusDetail.value, {
      description: statusDetail.value.description ?? ""
    })
    
    if (statusDetail.value.name == 'No Status' || statusDetail.value.name == 'Done') {
      router.push({ name: 'status' })
      store.ToastMessage = {
        msg: `Cannot edit default status (${statusDetail.value.name})`,
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
    store.ErrorMessage = 'An error has occurred, the status does not exist'
    store.isError = true
    statusDetail.value = {}
    return error
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
        .filter((task) => task.status.name == oldDetail.name)
        .map((task) => (task.status.name = updateDetail.value.name))
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

watch([() => updateDetail.value.name, () => updateDetail.value.description], () => {
  if (updateDetail.value.name.length > 50 || updateDetail.value.description.length > 200) {
    return (isTextOver.value = true)
  } else {
    return (isTextOver.value = false)
  }
})

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
          <label class="form-control w-full">
            <div class="label">
              [{{ updateDetail.name.length }}/50]
              <div v-if="updateDetail.name.length > 50">
                <p class="text-red-500">Name cannot be more than 50 characters.</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Unname"
              v-model="updateDetail.name"
              class="itbkk-status-name w-full p-2 rounded-md hover:bg-gray-500 hover:bg-opacity-20"
            />
          </label>
        </div>
        <div class="w-full flex flex-col gap-2">
          <span class="w-full divider divider-start mb-0"><b>Description</b></span>

          <label class="form-control w-full">
            <div class="label">
              [{{ updateDetail.description.length }}/200]
              <div v-if="updateDetail.description.length > 200">
                <p class="text-red-500">Description cannot be more than 200 characters.</p>
              </div>
            </div>
            <textarea
            placeholder="Add some status ..."
            v-model="updateDetail.description"
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
          :disabled="!updateDetail.name || (isSameDetail || isTextOver)"
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
