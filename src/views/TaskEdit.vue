<script setup>
import { updateTask } from '@/lib/fetchAPI'
import { formatStatusReverse, onMountSetup } from '@/lib/util'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { compile, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
// console.log('EDITTTT===================')
const route = useRoute()
const store = useTaskStore()
const id = router.currentRoute.value.params.id
// const updateDetail = store.taskList[store.findTaskIndexById(id)]
// console.log(updateDetail);

const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const date = ref(new Date().toLocaleString('en-GB').replace('T', ' '))

let taskDetail = {}
let oldDetail = {}
const updateDetail = ref({})
onMounted(async () => {
  taskDetail = await onMountSetup()
  oldDetail =  JSON.parse(JSON.stringify(taskDetail))
  updateDetail.value = taskDetail
})

const isInValid = ref(false)

const isSameDetail = computed(() => {

  return JSON.stringify(oldDetail) === JSON.stringify(updateDetail.value)
})

async function editTask() {
  store.resStatus = ""
  isInValid.value = false
  if (isSameDetail.value) {
    return router.push('/task')
  }
  if (!updateDetail.value.title) {
    return (isInValid.value = true)
  } else {
    updateDetail.value = {
      title: updateDetail.value.title.trimEnd(),
      assignees: !updateDetail.value.assignees ? null : updateDetail.value.assignees.trimEnd(),
      status: updateDetail.value.status,
      description: !updateDetail.value.description ? null : updateDetail.value.description.trimEnd()
    }
    // let addtask function and send out info into the main page :D
    try {
      const result = await updateTask(taskDetail.id, updateDetail.value)
      Object.assign(store.taskList[store.findTaskIndexById(result.data.id)], result.data)
      store.resStatus = "editDone"
      router.push('/task')
    } catch (error) {
      store.resStatus = "updateError"
      throw error
    }
    router.push('/task')
  }
}

const inputField = 'p-2 col-span-3 hover:bg-slate-400 hover:bg-opacity-20 duration-150 rounded-md'
const header = 'text-gray-900 text-opacity-50 font-semibold'
</script>
<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-md text-slate-900"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40"
      @click="router.push(`/task`)"
    ></div>

    <div
      name="updateDetail"
      class="fixed w-[640px] h-5/6 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center"
    >
      <div class="w-auto flex flex-row justify-between m-12 mb-0">
        <div class="text-sm breadcrumbs">
          <ul>
            <li
              class="hover:underline hover:cursor-pointer text-[#9c9c9c]"
              @click="router.push(`/task`)"
            >
              Task
            </li>
            <li>{{ route.params.id }}</li>
            <li>Edit</li>
          </ul>
        </div>
        <div></div>
      </div>
      <div v-if="isInValid" class="kbd kbd-md mx-12 bg-red-300">invalid title required!!!!</div>
      <div class="overflow-y-auto h-full m-12 my-0 mb-4">
        <input
          type="text"
          maxlength="100"
          placeholder="Untitled"
          v-model="updateDetail.title"
          class="itbkk-title w-full h-auto text-2xl font-bold mb-4 break-words inline-block border border-none"
        />
        <div class="grid grid-cols-4 gap-y-2 text-md items-center">
          <span :class="header"> Status </span>
          <select
            class="itbkk-status select select-bordered select-md w-full text-base p-0"
            :class="inputField"
            v-model="updateDetail.status"
          >
            
            <option value="NO_STATUS">No Status</option>
            <option value="TODO">To Do</option>
            <option value="DOING">Doing</option>
            <option value="DONE">Done</option>
          </select>
          <!-- <input type="test" v-model="updateDetail.status" placeholder="Empty" :class="inputField" /> -->
          <span :class="header" class="col-span-1"> Assignees </span>
          <input
            type="test"
            maxlength="30"
            v-model="updateDetail.assignees"
            placeholder="Empty"
            class="itbkk-assignees"
            :class="inputField"
            :autofocus="
              !updateDetail.assignees
                ? ''
                : (updateDetail.assignees = updateDetail.assignees.trimStart())
            "
          />
          <span :class="header" class="col-span-1"> Timezone </span>
          <div v-text="timezone" class="itbkk-timezone col-span-3 p-2"></div>
          <span :class="header" class="col-span-1">CreateOn</span>
          <div v-text="updateDetail.createdOn" class="itbkk-created-on col-span-3 p-2"></div>
          <span :class="header" class="col-span-1">UpdateOn</span>
          <div v-text="updateDetail.updatedOn" class="itbkk-updated-on col-span-3 p-2"></div>
        </div>
        <div class="w-full flex flex-col gap-2">
          <span :class="header" class="w-full divider divider-start">Description</span>
          <textarea
            placeholder="Hi"
            maxlength="500"
            v-model="updateDetail.description"
            class="itbkk-description w-full h-28"
            :autofocus="
              !updateDetail.description
                ? ''
                : (updateDetail.description = updateDetail.description.trimStart())
            "
          ></textarea>
        </div>
      </div>
      <div class="right-0 m-12 mt-0 flex justify-center gap-4">
        <button @click="editTask()" v-if="!isSameDetail" class="itbkk-button-confirm btn bg-green-400">Save</button>
        <button @click="router.push('/task')" class="itbkk-button-cancel btn bg-grey-400">Cancel</button>
      </div>
    </div>
  </div>
</template>
<style></style>
