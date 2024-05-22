<script setup>
import { updateMethod } from '@/lib/fetchAPI'
import { formatStatusReverse, onMountSetup, colorStatus } from '@/lib/util'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { compile, computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ErrorModal from './ErrorModal.vue'
import TaskDetail from './TaskDetail.vue'
const route = useRoute()
const store = useTaskStore()
const id = router.currentRoute.value.params.id
const statusName = ref('')
const maxStatus = ref(false)
const isTextOver = ref(false)

const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const date = ref(new Date().toLocaleString('en-GB').replace('T', ' '))

const taskDetail = ref({})
// console.log("edit")
let oldDetail = {}
const updateDetail = ref({})
store.isError = false
onMounted(async () => {
  try {
    taskDetail.value = await onMountSetup('tasks')
    // store.errorRes = (await taskDetail.value.getMode) ?? 'Done'
    oldDetail = JSON.parse(JSON.stringify(taskDetail.value))
    updateDetail.value = taskDetail.value
    Object.assign(updateDetail.value, {
      assignees: updateDetail.value.assignees ?? '',
      description: updateDetail.value.description ?? ''
    })
    // console.log(updateDetail.value.status.id);
    // console.log(oldDetail)
  } catch (error) {
    store.ErrorMessage = 'The task does not exist'
    store.isError = true
    taskDetail.value = {}
    throw error
  }
})

const isInValid = ref(false)

const isSameDetail = computed(() => {
  return JSON.stringify(oldDetail) === JSON.stringify(updateDetail.value)
})

async function editTask() {
  store.resStatus = ''
  isInValid.value = false

  //Check if the status reached the limits
  for (const index in store.limitInfo) {
    console.log(updateDetail.value.status.id === store.limitInfo[index].id)
    console.log(store.limitSwitch)
    console.log(!['No Status', 'Done'].includes(updateDetail.value.status.name))
    if (
      updateDetail.value.status.id === store.limitInfo[index].id &&
      store.limitSwitch &&
      !['No Status', 'Done'].includes(updateDetail.value.status.name)
    ) {
      console.log('limit')
      statusName.value = store.limitInfo[index].name
      return (maxStatus.value = true)
    }
  }

  if (isSameDetail.value) {
    return router.push({ name: 'task' })
  }
  if (!updateDetail.value.title) {
    return (isInValid.value = true)
  } else {
    updateDetail.value = {
      id: updateDetail.value.id,
      title: updateDetail.value.title.trim(),
      assignees: !updateDetail.value.assignees ? null : updateDetail.value.assignees.trim(),
      status: updateDetail.value.status.id,
      description: !updateDetail.value.description ? null : updateDetail.value.description.trim()
    }
    // let addtask function and send out info into the main page :D
    let result
    try {
      // console.log(taskDetail.value.id);
      result = await updateMethod(taskDetail.value.id, 'tasks', updateDetail.value)
      Object.assign(store.taskList[store.findTaskIndexById(result.data.id)], result.data)
      // Object.assign(store.statusList)
      // console.log('old : ', oldDetail)
      // console.log('result : ', result.data.status)
      const findResultStatus = store.statusList.find((status) => status.id == result.data.status.id)
      const findOldStatus = store.statusList.find(
        (status) => status.id == oldDetail.status.id
      )
      // if (updateDetail.value.status.id != result.data.status.id) {
        console.log('cal new count')
        Object.assign(findResultStatus, {
          noOfTasks: findResultStatus.noOfTasks + 1
        })
        Object.assign(findOldStatus, {
          noOfTasks: findOldStatus.noOfTasks - 1
        })
      // }
      // console.log(findOldStatus)
      // console.log(findResultStatus)
      store.resStatus = 'editDone'
      router.push({ name: 'task' })
      store.ToastMessage = {
        msg: 'The task has been updated',
        color: 'cyan'
      }
    } catch (error) {
      store.resStatus = 'updateError'
      throw error
    }
    const oldStatus = store.statusList.find((status) => status.id == oldDetail.status.id)
    // console.log(oldStatus);
    oldStatus.countTask == 0 ? '' : --oldStatus.countTask
    // console.log(oldStatus)
    const newStatus = store.statusList.find((status) => status.id == result.data.status.id)
    // console.log(newStatus);
    newStatus.countTask = ++newStatus.countTask
    // console.log(newStatus);
    router.push({ name: 'task' })
  }
}

watch(
  [
    () => updateDetail.value.title,
    () => updateDetail.value.assignees,
    () => updateDetail.value.description
  ],
  () => {
    if (updateDetail.value.assignees != null && updateDetail.value.description != null) {
      if (
        updateDetail.value.title.length > 100 ||
        updateDetail.value.assignees.length > 30 ||
        updateDetail.value.description.length > 500
      ) {
        return (isTextOver.value = true)
      } else {
        return (isTextOver.value = false)
      }
    } else {
      updateDetail.value.assignees = ''
      updateDetail.value.description = ''
    }
  }
)

const inputField = 'p-2 col-span-3 hover:bg-slate-400 hover:bg-opacity-20 duration-150 rounded-md'
const header = 'text-gray-900 text-opacity-50 font-semibold'
</script>
<template>
  <div
    v-if="Object.keys(taskDetail).length !== 0 && !store.isError"
    class="fixed z-[2] top-0 left-0 w-full h-full flex justify-center items-center font-sans text-md text-slate-900"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40"
      @click="router.push({ name: 'task' })"
    ></div>

    <div name="updateDetail" class="fixed w-[640px] h-auto bg-white flex flex-col gap-4 rounded-xl">
      <div class="w-auto flex flex-row justify-between m-12 mb-0">
        <div class="text-sm breadcrumbs">
          <ul>
            <li
              class="hover:underline hover:cursor-pointer text-[#9c9c9c]"
              @click="router.push({ name: 'task' })"
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
        <label class="form-control w-full">
          <div
            class="label p-0 pb-[2px] font-semibold"
            :class="{ 'text-red-500': updateDetail.title.length > 100 }"
          >
            ({{ updateDetail.title.length }}/100)
            <div v-if="updateDetail.title.length > 100">
              <p class="text-red-500">Title cannot be more than 100 characters.</p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Untitled"
            v-model="updateDetail.title"
            :autofocus="
              !updateDetail.title ? '' : (updateDetail.title = updateDetail.title.trimStart())
            "
            class="itbkk-title w-full h-auto text-2xl font-bold mb-4 break-words inline-block border border-none focus:border-transparent focus:outline-none"
          />
        </label>
        <div class="grid grid-cols-4 gap-y-2 text-md items-center">
          <span :class="header"> Status </span>
          <select
            class="itbkk-status select select-bordered select-md w-full text-base p-0"
            :class="inputField"
            v-model="updateDetail.status.id"
          >
            <option disabled selected>Pick one</option>
            <option
              v-for="status in store.statusList"
              :key="status.id"
              :value="status.id"
              :class="colorStatus(status.color)"
            >
              {{ status.name }}
            </option>
          </select>
          <!-- <input type="test" v-model="updateDetail.status" placeholder="Empty" :class="inputField" /> -->
          <span :class="header" class="col-span-1">
            Assignees
            <span :class="{ 'text-red-500': updateDetail.assignees.length > 30 }"
              >({{ updateDetail.assignees.length }}/30)</span
            ></span
          >
          <label class="form-control w-full col-span-3">
            <div class="label p-0 pl-1 font-semibold">
              <div v-if="updateDetail.assignees.length > 30">
                <p class="text-red-500">Assignees cannot be more than 30 characters.</p>
              </div>
            </div>
            <input
              type="test"
              v-model="updateDetail.assignees"
              placeholder="Empty"
              class="itbkk-assignees w-full"
              :class="inputField"
            />
          </label>
          <span :class="header" class="col-span-1"> Timezone </span>
          <div v-text="timezone" class="itbkk-timezone col-span-3 p-2"></div>
          <span :class="header" class="col-span-1">CreateOn</span>
          <div v-text="updateDetail.createdOn" class="itbkk-created-on col-span-3 p-2"></div>
          <span :class="header" class="col-span-1">UpdateOn</span>
          <div v-text="updateDetail.updatedOn" class="itbkk-updated-on col-span-3 p-2"></div>
        </div>
        <div class="w-full flex flex-col">
          <span :class="header" class="w-full divider divider-start mb-0"
            >Description<span :class="{ 'text-red-500': updateDetail.description.length > 500 }"
              >({{ updateDetail.description.length }}/500)</span
            >
          </span>

          <label class="form-control w-full">
            <div class="label pb-0 font-semibold">
              <p v-if="updateDetail.description.length > 500" class="text-red-500">
                Description cannot be more than 500 characters.
              </p>
            </div>
            <textarea
              placeholder="Hi"
              v-model="updateDetail.description"
              class="itbkk-description w-full max-h-48 min-h-48"
              :class="inputField"
            ></textarea>
          </label>
        </div>
      </div>

      <div class="right-0 m-12 my-10 mt-0 flex flex-col justify-center gap-2">
        <div v-if="maxStatus" class="text-red-400 text-center font-semibold">
          The status {{ statusName }} will have too many tasks. <br />
          Please make progress and updatestatus of existing tasks'
        </div>

        <!-- Enabled/Disabled State -->
        <div v-if="store.limitSwitch">
          <p class="text-center text-green-400"><b>Kaban board limits is enabled!</b></p>
          <br />
        </div>
        <div v-else>
          <p class="text-center text-red-400"><b>Kaban board limits is disabled!</b></p>
          <br />
        </div>
        <div class="flex justify-center gap-4">
          <button
            @click="editTask()"
            v-if="!isSameDetail && !isTextOver"
            class="itbkk-button-confirm btn bg-green-400"
          >
            Save
          </button>
          <button
            @click="router.push({ name: 'task' })"
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
