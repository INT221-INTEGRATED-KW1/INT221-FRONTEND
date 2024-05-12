<script setup>
import { deleteMethod, deleteTranMethod, getMethod } from '@/lib/fetchAPI'
import { onMountSetup, colorStatus } from '@/lib/util'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorModal from './ErrorModal.vue'
const store = useTaskStore()
const statusList = store.statusList
const route = useRoute()
const id = route.params.id
const currentData = ref({})
let hasTask = []
setTimeout(async () => {
  const item = store.statusList.find((status) => status.id == id) ?? {}
  // console.log(item)
  currentData.value = item
  hasTask = store.taskList.filter((task) => task.status == item.name)
  // console.log(hasTask);
}, 100)
store.isError = false
const isHastask = ref(false)
const deleteStatus = async (statusId) => {
  isHastask.value = false
  if (hasTask.length == 0) {
    let res = null
    try {
      res = await deleteMethod(statusId, 'statuses')
    } catch (error) {
      store.ErrorMessage = 'An error has occurred, the status does not exist.'
      // console.log(store.ErrorMessage)
      return (store.isError = true)
    }
    const index = statusList.findIndex((status) => status.id == res.data.id)
    statusList.splice(index, 1)
    router.push({ name: 'status' })
    store.ToastMessage = {
      msg: 'The status has been deleted',
      color: 'yellow'
    }
    store.resStatus = 'deleteDone'
  } else if (hasTask.length >= 0) {
    isHastask.value = true
  }
}

const tranferStatus = async (currId, newId) => {
  let res = null
  try {
    res = await deleteTranMethod(currId, 'statuses', newId)
  } catch (error) {
    throw error
  }
  isHastask.value = false
  //delete item in status menu , map item in task menu
  const index = store.statusList.findIndex((status) => status.id == currId)
  store.taskList
    .filter((task) => task.status == store.statusList[index].name)
    .map((task) => (task.status = res.data.name))
  statusList.splice(index, 1)
  router.push({ name: 'status' })
  store.ToastMessage = {
    msg: 'The task(s) have been transferred and the status has been deleted',
    color: 'yellow'
  }
  store.resStatus = 'deleteDone'
}

const tranferId = ref(0)
</script>

<template>
  <div
    class="fixed z-[2] top-0 left-0 w-full h-full flex justify-center items-center font-sans text-md text-slate-900"
    v-if="!store.isError"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40 blur-sm"
      @click="router.push({ name: 'status' })"
    ></div>

    <div
      v-if="!isHastask"
      name="detail"
      class="fixed w-[640px] h-[280px] bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center items-center justify-center"
    >
      <div class="">Delete a Status</div>
      <p>
        Do you want to delete the <span class="font-semibold">"{{ currentData.name }}"</span> Status
        ?
      </p>
      <div class="flex justify-center gap-4">
        <button @click="deleteStatus(id)" class="itbkk-button-confirm btn bg-green-400">
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
    <div
      v-if="isHastask"
      name="detail"
      class="fixed w-[640px] h-[280px] bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center items-center justify-center"
    >
      <div>Tranfer a Status</div>
      <p>There is some task associated with the "{{ currentData.name }}" status.</p>
      <div>
        <p></p>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Tranfer to</span>
          </div>
          <select class="select select-bordered" v-model="tranferId">
            <option disabled selected>Pick one</option>
            <option
              v-for="status in store.statusList"
              :key="status.id"
              :value="status.id"
              :class="colorStatus(status.color)"
              :disabled="status.id == id"
            >
              {{ status.name }}
            </option>
          </select>
        </label>
        <div class="flex justify-center gap-4">
          <button
            @click="tranferStatus(currentData.id, tranferId)"
            class="itbkk-button-confirm btn bg-green-400"
          >
            Transfer and Delete
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
  </div>

  <ErrorModal v-if="store.isError">
    <template #message>{{ store.ErrorMessage }}</template>
  </ErrorModal>
</template>

<style></style>
