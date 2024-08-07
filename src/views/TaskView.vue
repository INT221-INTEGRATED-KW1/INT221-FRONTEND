<script setup>
import { ref, watch } from 'vue'
import { deleteMethod, getMethod } from '../lib/fetchAPI'
import router from '@/router/router'
import { colorStatus, alertMessage, statusColors } from '@/lib/util'
import { useRoute } from 'vue-router'
import {
  ArchiveBoxXMarkIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  EllipsisVerticalIcon,
  FireIcon,
  PlusIcon,
  Squares2X2Icon,
  SwatchIcon,
  UserCircleIcon,
  AdjustmentsHorizontalIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  TruckIcon,
  ArrowsUpDownIcon,
  CloudIcon
} from '@heroicons/vue/24/outline'
import { useTaskStore } from '@/store/store'
import ToastMessage from '@/components/ToastMessage.vue'
import ErrorModal from '@/components/ErrorModal.vue'
const store = useTaskStore()
const taskList = store.taskList
const route = useRoute()
const SearchKey = ref('')
const isDeleting = ref(false)
const isComplete = ref(false)
const currentId = ref(0)
const currentTask = ref('')
function showDeleteModal(id) {
  currentId.value = id
  currentTask.value = taskList[store.findTaskIndexById(id)]
  isDeleting.value = true
  store.errorRes = 'Done'
}
async function delTask(id) {
  isComplete.value = false
  let result

  result = await deleteMethod(id, 'tasks')
  taskList.splice(store.findTaskIndexById(id), 1)
  if (result.resCode != '200') {
    store.ErrorMessage = `An error has occurred, the status does not exist.`
    store.isError = true
    return (isDeleting.value = false)
  }
  store.ToastMessage.push({
    msg: 'The task has been deleted',
    color: 'green'
  })
  isDeleting.value = false
  store.statusList[result.data.status.id - 1].countTask =
    store.statusList[result.data.status.id - 1].countTask - 1
}

const thead = ref(
  'h-full flex flex-row items-center gap-[4px] text-sm font-semibold text-black opacity-80'
)

function matchColor(statusName) {
  const result = store.statusList.find((status) => status.name == statusName) ?? 'grey'
  const color = colorStatus(result.color)
  return color
}

const filterList = ref([])
const taskListDisplay = ref(store.taskList)
const sortBy = ref(null)

async function fetchTasksValidate() {
  try {
    const result = await getMethod('tasks', sortBy.value, filterList.value)
    taskListDisplay.value = result.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    taskListDisplay.value = store.taskList
  }
}
// FILTER and SORT BE version
watch(
  [() => filterList.value, () => sortBy.value],
  () => {
    if (!filterList.value.length) {
      taskListDisplay.value = store.taskList
    } else {
      fetchTasksValidate()
    }
  },
  { deep: true }
)

const sortByASC = ref(true)
const sortType = ref('')
function sortMethod(source, property, nestedProperty = null) {
  sortType.value = property
  source.sort((a, b) => {
    let itemA = a[property] ?? ''
    let itemB = b[property] ?? ''
    if (nestedProperty && itemA && itemB) {
      itemA = itemA[nestedProperty]
      itemB = itemB[nestedProperty]
    }
    let compare = 0
    compare = itemA.localeCompare(itemB)
    return sortByASC.value ? compare : -compare
  })
  sortByASC.value = !sortByASC.value
}

const removeStatus = (index) => {
  filterList.value.splice(index, 1)
  filterList.value = filterList.value.slice()
}
</script>

<template>
  <div
    class="w-full h-auto min-h-screen p-24 flex flex-col gap-4 font-sans text-slate-900 bg-white"
  >
    <div class="w-full h-28 font-bold text-4xl flex flex-col justify-center gap-1">
      <h1 class="">IT-Bangmod Kradan Kanban</h1>
      <h2 class="text-3xl"></h2>
      <p class="text-base font-medium">Do something better than do nothing .</p>
    </div>
    <div class="css-selector w-full h-1"></div>
    <div name="optionlist" class="w-full px-6 flex flex-row gap-0 items-center">
      <div class="w-3/4 pr-20 h-auto flex justify-start gap-2">
        <div class="dropdown dropdown-bottom">
          <div tabindex="0" role="button" class="itbkk-status-filter btn m-1 hover:shadow-inner">
            <SwatchIcon class="size-6 h-9" />
          </div>
          <div
            tabindex="0"
            class="dropdown-content z-[1] menu shadow bg-slate-50 rounded-box w-64 flex flex-row p-6"
          >
            <div class="w-full flex items-center">
              <h1 class="w-3/4 font-semibold text-base">
                Filter (selected {{ filterList.length }})
              </h1>
              <div class="itbkk-filter-clear w-1/4 flex justify-end">
                <ArchiveBoxXMarkIcon
                  class="itbkk-filter-clear size-6 cursor-pointer hover:shadow-inner"
                  @click="filterList = []"
                />
              </div>
            </div>
            <div class="divider w-full my-[1px]"></div>
            <label class="input input-bordered flex items-center gap-2 w-[210px]">
              <input type="text" class="" placeholder="Search" v-model="SearchKey" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="w-4 h-4 opacity-70"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clip-rule="evenodd"
                />
              </svg>
            </label>
            <li v-for="(status, index) in store.statusList" :key="index" class="w-full">
              <label
                class="cursor-pointer w-full"
                v-show="
                  status.name
                    .toLowerCase()
                    .trim()
                    .replace(/\s/g, '')
                    .includes(
                      SearchKey.toLowerCase().trim().replace(/\s/g, '') ?? status.name.toLowerCase()
                    )
                "
              >
                <input
                  type="checkbox"
                  class="peer size-4"
                  name="color"
                  v-model="filterList"
                  :value="status.name"
                />
                <div
                  class="itbkk-status-choice rounded-md w-full px-[8px] py-[2px] ring-2 ring-transparent transition-all text-center content-center flex flex-row gap-2 items-center"
                >
                  <div
                    :class="statusColors[status.color]"
                    class="size-4 rounded-full shadow-inner"
                  ></div>
                  <span class="text-base text-start"
                    >{{ status.name }} ({{ status.noOfTasks }})</span
                  >
                </div>
              </label>
            </li>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 items-center">
          <div
            v-for="(status, index) in filterList"
            :key="index"
            class="itbkk-filter-item w-auto rounded-md px-[8px] py-[2px]"
            :class="matchColor(status)"
          >
            {{ status }}
            <span class="itbkk-filter-item-clear" @click="removeStatus(index)"> x </span>
          </div>
        </div>
      </div>
      <div class="w-1/4 h-auto flex justify-end gap-4">
        <button
          @click="router.push({ name: 'addTask' })"
          class="itbkk-button-add btn px-4 h-9 min-h-9 shadow-inner bg-sky-300 hover:bg-sky-400 hover:border-sky-400 border-none"
        >
          <PlusIcon class="size-6"></PlusIcon>
          Add
        </button>

        <button
          @click="router.push({ name: 'status' })"
          class="itbkk-manage-status btn px-4 h-9 min-h-9 shadow-inner bg-yellow-300 hover:bg-yellow-400 hover:border-yellow-400 border-none"
        >
          <span :class="thead"
            ><Squares2X2Icon class="size-6" />
            <p>Status M.</p></span
          >
        </button>

        <button
          @click="router.push({ name: 'limitStatus' })"
          class="itbkk-status-setting btn px-4 h-9 min-h-9 shadow-inner bg-green-400 hover:bg-green-400 hover:border-green-400 border-none hover:shadow-inner"
        >
          <span :class="thead">
            <AdjustmentsHorizontalIcon class="size-6" />
          </span>
        </button>

        <div
          class="btn px-4 h-9 min-h-9 bg-opacity-80 hover:shadow-inner text-whit"
          @click="router.go()"
        >
          <TruckIcon class="size-6 text-gray-700" />
        </div>
      </div>
    </div>
    <div
      name="data"
      class="w-full flex flex-col justify-center items-center px-6 bg-white rounded-2xl"
    >
      <table class="table rounded-3xl w-auto">
        <thead class="border-b-[1px] border-opacity-10 bg-gray-600 bg-opacity-20">
          <tr>
            <td class="w-3/5 border-r-[1px] border-opacity-10">
              <span class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <CloudIcon class="size-6" />
                  <p>Title</p>
                </div>
                <div class="flex gap-2 justify-center items-center">
                  <div
                    class="btn p-0 px-2 justify-center bg-opacity-80 hover:shadow-inner text-white"
                    @click="sortMethod(taskListDisplay, 'title')"
                  >
                    <ArrowsUpDownIcon class="size-6 text-gray-700" />
                  </div>
                </div>
              </span>
            </td>
            <td class="w-1/5 border-r-[1px] border-opacity-10">
              <span class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <UserCircleIcon class="size-6" />
                  <p>Assignees</p>
                </div>
                <div class="flex gap-2 justify-center items-center">
                  <div
                    class="btn p-0 px-2 justify-center bg-opacity-80 hover:shadow-inner text-white"
                    @click="sortMethod(taskListDisplay, 'assignees')"
                  >
                    <ArrowsUpDownIcon class="size-6 text-gray-700" />
                  </div>
                </div>
              </span>
            </td>
            <td class="w-1/5">
              <span class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <FireIcon class="size-6" />
                  <p>Status</p>
                </div>
              </span>
            </td>
            <td>
              <div class="flex gap-2 justify-center items-center">
                <div
                  class="itbkk-status-sort btn p-0 px-2 justify-center bg-opacity-80 hover:shadow-inner text-white"
                  @click="sortMethod(taskListDisplay, 'status', 'name')"
                >
                  <ArrowsUpDownIcon class="size-6 text-gray-700" />
                </div>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in taskListDisplay"
            :key="task.id"
            class="hover:cursor-pointer hover:bg-gray-300 hover:bg-opacity-20 transition duration-75 itbkk-item"
          >
            <td
              class="itbkk-title border-r-[1px] border-opacity-10 whitespace-normal"
              :class="{ 'itbkk-title': !route.params.id }"
              @click="router.push({ name: 'taskDetail', params: { id: task.id } })"
            >
              {{ task.title }}
            </td>
            <td
              :class="{
                'italic text-gray-500': !task.assignees,
                'itbkk-assignees': !route.params.id
              }"
              class="border-r-[1px] whitespace-normal"
            >
              {{ !task.assignees ? 'Unassigned' : task.assignees }}
            </td>
            <td class="itbkk-status w-1/6">
              <div
                class="rounded-md px-[8px] py-[2px] w-fit"
                :class="[matchColor(task.status.name), { 'itbkk-status': !route.params.id }]"
              >
                {{ task.status.name }}
              </div>
            </td>
            <td class="dropdown dropdown-bottom dropdown-end">
              <div tabindex="0" role="button" class="m-1">
                <EllipsisVerticalIcon class="itbkk-button-action size-6 hover:scale-150" />
              </div>
              <ul
                tabindex="0"
                class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li class="">
                  <a
                    @click="router.push({ name: 'editTask', params: { id: task.id } })"
                    class="itbkk-button-edit"
                    >Edit</a
                  >
                </li>
                <li class="text-red-500 hover:bg-red-300 bg-red-300 rounded-lg">
                  <a @click="showDeleteModal(task.id)" class="itbkk-button-delete">Delete</a>
                </li>
              </ul>
            </td>
          </tr>

          <tr v-if="taskListDisplay.length == 0">
            <td
              colspan="4"
              class="text-center font-momo italic font-semibold text-opacity-70 whitespace-normal"
            >
              No task
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ToastMessage></ToastMessage>

  <div
    v-if="isDeleting && store.errorRes == 'Done'"
    class="fixed top-0 z-[1] left-0 w-full h-full flex justify-center items-center font-sans text-sm text-slate-900"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40 itbkk-button"
      @click="isDeleting = false"
    ></div>
    <transition>
      <div
        name="detail"
        class="fixed w-[640px] h-auto p-8 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center justify-center"
      >
        <img src="/public/trash-can.png" alt="" class="size-24 mx-auto" />
        <h1 class="w-full text-center font-semibold text-xl">Deleting</h1>
        <p class="itbkk-message w-full text-center text-lg break-words inline-block">
          Do you want to delete the task number {{ currentTask.id }}
          <span v-text="currentTask.title"></span> ?
        </p>
        <div class="w-full flex flex-row gap-4 justify-center items-center mt-4">
          <button class="itbkk-button-confirm btn bg-green-400" @click="delTask(currentId)">
            Confirm
          </button>
          <button class="itbkk-button-cancel btn bg-slate-300" @click="isDeleting = false">
            Cancel
          </button>
        </div>
      </div>
    </transition>
  </div>
  <router-view />

  <ErrorModal v-if="store.isError">
    <template #message>{{ store.ErrorMessage }}</template>
  </ErrorModal>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.slide-bottom {
  animation: slide-bottom 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}

.alert-enter-active,
.alert-leave-active {
  animation: slide-bottom 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}

.alert-enter,
.alert-leave-to {
  animation: slide-top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}

@keyframes slide-bottom {
  0% {
    transform: translateY(-100px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes slide-top {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100px);
  }
}

.css-selector {
  background: linear-gradient(
    180deg,
    #b90000,
    #ff3535,
    #fffb35,
    #6cff35,
    #35ffc2,
    #35a4ff,
    #4b35ff
  );
  background-size: 1400% 1400%;
  -webkit-animation: AnimationName 30s ease infinite;
  -moz-animation: AnimationName 30s ease infinite;
  animation: AnimationName 10s ease infinite;
}

@-webkit-keyframes AnimationName {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 51% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
}
@-moz-keyframes AnimationName {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 51% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
}
@keyframes AnimationName {
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 51% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
}
</style>
