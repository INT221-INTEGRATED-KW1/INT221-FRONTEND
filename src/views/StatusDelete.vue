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
const tranferId = ref(0)
let hasTask = []
onMounted(() => {
  const item = store.statusList.find((status) => status.id == id) ?? {
    id: route.params.id,
    name: 'No Status',
    name: 'Done'
  }
  currentData.value = item
  // console.log(currentData.value)
  hasTask = store.taskList.filter((task) => task.status.name == item.name)
})
store.isError = false
const isHastask = ref(false)
const deleteStatus = async (statusId) => {
  isHastask.value = false
  if (hasTask.length == 0) {
    let res = null
    try {
      res = await deleteMethod(statusId, 'statuses')
      if (res.resCode == '500') {
        router.push({ name: 'status' })
        store.ToastMessage = {
          msg: `Cannot delete default status (${currentData.value.name})`,
          color: 'red',
          erroricon: true
        }
        return
      } else if (res.resCode == '400') throw new error()
    } catch (error) {
      store.ErrorMessage = 'An error has occurred, the status does not exist.'
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
  const index = store.statusList.findIndex((status) => status.id == currId)
  const tindex = store.statusList.findIndex((status) => status.id == tranferId.value)
  try {
    res = await deleteTranMethod(currId, 'statuses', newId)
    if (res.resCode == '404') throw new error()
  } catch (error) {
    store.ErrorMessage = `Cannot transfer to number of task in ${store.statusList[tindex].name} status since it will exceed the limit. Please choose another status to transfer to.`
    isHastask.value = false
    return (store.isError = true)
  }
  isHastask.value = false
  // console.log(store.taskList);
  //delete item in status menu , map item in task menu

  const newindex = store.statusList.findIndex((status) => status.id == newId)
  const total = store.taskList.filter(
    (task) => task.status.name == store.statusList[index].name
  ).length
  // const findStatus = store.statusList.find((status) => status.id == result.data.id)
  Object.assign(store.statusList[newindex], {
    noOfTasks: store.statusList[newindex].noOfTasks + total
  })
  store.taskList
    .filter((task) => task.status.name == store.statusList[index].name)
    .map((task) => (task.status.name = res.data.name))
  statusList[newindex].countTask = statusList[newindex].countTask + total
  statusList.splice(index, 1)
  router.push({ name: 'status' })
  store.ToastMessage = {
    msg: `The ${total} task(s) have been transferred and the status has been deleted`,
    color: 'yellow'
  }
  store.resStatus = 'deleteDone'
}
</script>

<template>
  <div
    class="fixed z-[2] top-0 left-0 w-full h-full flex justify-center items-center font-sans text-md text-slate-900"
    v-if="!store.isError"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40"
      @click="router.push({ name: 'status' })"
    ></div>

    <div
      v-if="!isHastask"
      name="detail"
      class="fixed w-[640px] h-auto py-8 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center items-center justify-center"
    >
      <img src="/public/trash-can.png" alt="" class="size-24 mx-auto" />
      <div class="w-full text-center font-semibold text-xl">Delete a Status</div>
      <p class="itbkk-message">
        Do you want to delete the <span class="font-semibold">"{{ currentData.name }}"</span> Status
        ?
      </p>
      <div class="flex justify-center gap-4">
        <button @click="deleteStatus(currentData.id)" class="itbkk-button-confirm btn bg-green-400">
          Confirm
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
      class="fixed w-[640px] h-auto py-8 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center items-center justify-center"
    >
      <img src="/public/return.png" alt="" class="size-24 mx-auto" />

      <div class="w-full text-center font-semibold text-xl">Tranfer a Status</div>
      <p class="itbkk-message">
        There is some task associated with the "<span class="font-semibold">{{
          currentData.name ?? 'No status'
        }}</span
        >" status.
      </p>
      <div>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Tranfer to</span>
          </div>
          <select class="select select-bordered itbkk-status" v-model="tranferId">
            <option disabled selected>Pick one</option>
            <option
              v-for="status in store.statusList"
              :key="status.id"
              :value="status.id"
              :class="colorStatus(status.color)"
              :hidden="status.id == id"
            >
              {{ status.name }}
            </option>
          </select>
        </label>
        <div class="flex justify-center gap-4 mt-4">
          <button
            @click="tranferStatus(currentData.id, tranferId)"
            class="itbkk-button-confirm btn bg-green-400"
            :disabled="!tranferId"
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
