<script setup>
import { deleteMethod, deleteTranMethod, getMethod } from '@/lib/fetchAPI'
import { onMountSetup, colorStatus } from '@/lib/util'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorModal from '../ErrorModal.vue'
const store = useTaskStore()
const statusList = store.statusList
const route = useRoute()
const id = route.params.id
const currentData = ref({})
const tranferId = ref(0)
let total = 0
onBeforeMount(() => {
  if (!store.statusList.find((status) => status.id == id)) {
    store.ErrorMessage = `An error has occurred, the status does not exist.`
    return (store.isError = true)
  }
})

onMounted(() => {
  const item = store.statusList.find((status) => status.id == id) ?? {
    id: route.params.id,
    name: 'No Status',
    name: 'Done'
  }
  currentData.value = item
  // console.log(currentData.value)

  // if (store.statusList.find((status) => status.id == id)) {
  //   total = store.taskList.filter(
  //     (task) =>
  //       task.status.name ==
  //       store.statusList[store.statusList.findIndex((status) => status.id == id)].name
  //   ).length

  //   console.log(total);
    
  // }
})

store.isError = false
const isHastask = ref(false)
const deleteStatus = async (statusId) => {
  isHastask.value = false
  if (currentData.value.noOfTasks > 0) {
    isHastask.value = true
  }
  if (currentData.value.noOfTasks == 0) {
    let res = null
    res = await deleteMethod(statusId, 'statuses')
    // console.log(res.resCode)
    if (res.resCode == '403') router.push({ name: 'forbidden' })
    if (res.resCode == '500') {
      router.push({ name: 'status' })
      store.ToastMessage.push({
        msg: `Cannot delete default status (${currentData.value.name})`,
        color: 'red',
        erroricon: true
      })
      return
    }
    if (res.resCode != '200') {
      store.ErrorMessage = `An error has occurred, the status does not exist.`
      return (store.isError = true)
    }
    const index = statusList.findIndex((status) => status.id == res.data.id)
    statusList.splice(index, 1)
    router.push({ name: 'status' })
    store.ToastMessage.push({
      msg: 'The status has been deleted',
      color: 'yellow'
    })
    store.resStatus = 'deleteDone'
  }
}

const tranferStatus = async (currId, newId) => {
  const index = store.statusList.findIndex((status) => status.id == currId)
  const tindex = store.statusList.findIndex((status) => status.id == tranferId.value)
  const res = await deleteTranMethod(currId, 'statuses', newId)
  if (res.resCode != '200') {
    if (res.resCode == '400') {
      store.ErrorMessage = `Cannot transfer to ${store.statusList[tindex].name} status since it will exceed the limit. Please choose another status to tranfer to.`
    }
    if (res.resCode == '404') {
      store.ErrorMessage = `An error has occurred, the status does not exist.`
    }
    isHastask.value = false
    return (store.isError = true)
  }
  //delete item in status menu , map item in task menu
  else {
    const newindex = store.statusList.findIndex((status) => status.id == newId)
    store.statusList[newindex].noOfTasks = store.statusList[newindex].noOfTasks + currentData.value.noOfTasks 
    
    store.taskList
      .filter((task) => task.status.name == store.statusList[index].name)
      .map((task) => (task.status = res.data))
    statusList[newindex].countTask = statusList[newindex].countTask + total
    statusList.splice(index, 1)
    router.push({ name: 'status' })
    store.ToastMessage.push({
      msg: `The ${currentData.value.noOfTasks} task(s) have been transferred and the status has been deleted`,
      color: 'yellow'
    })
  }
  isHastask.value = false
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
      <p class="itbkk-message text-center px-8">
        There are {{ total }} tasks in
        <span class="font-semibold">{{ currentData.name ?? 'No status' }}</span> status. In order to
        delete this status, the system must transfer tasks in this status to existing status.
      </p>
      <div>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Tranfer tasks to</span>
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
