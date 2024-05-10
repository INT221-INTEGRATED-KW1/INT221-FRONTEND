<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router/router'
import { formatStatus, colorStatus, onMountSetup } from '@/lib/util'
import {
  ClipboardDocumentListIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  FireIcon,
  PlusIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'
import { useTaskStore } from '@/store/store'
import { getMethod } from '@/lib/fetchAPI'

const store = useTaskStore()
const statusList = store.statusList
// console.log(store.statusList.length)
// const statusList = ref(store.statusList)
const fetchStatus = async () => {
  // console.log(store.statusList.length)
  if (store.statusList.length === 0) {
    // console.log('A')
    try {
      // console.log(store.statusList)
      const statusRes = await getMethod('statuses')
      store.statusList = [...statusRes.data]
      // console.log(store.statusList)
    } catch (error) {
      console.error('Fail to get status', error)
    }
  } else {
    // console.log('B')
    return
  }
}
fetchStatus()

const thead = ref(
  'h-full flex flex-row items-center gap-[4px] text-sm font-semibold text-black opacity-80'
)
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
    <div class="flex px-6">
      <div class="w-1/2 h-auto flex justify-start gap-4">
        <div class="text-sm breadcrumbs">
          <ul>
            <li
              class="hover:underline hover:cursor-pointer text-[#9c9c9c]"
              @click="router.push(`/task`)"
            >
              Task
            </li>
            <li>Task Status</li>
          </ul>
        </div>
        <div></div>
      </div>
      <div class="w-1/2 h-auto flex justify-end gap-4">
        <button
          @click="router.push('/status/add')"
          class="itbkk-button-add btn px-4 h-9 min-h-9 bg-yellow-300 hover:bg-yellow-400 hover:border-yellow-400 border-none"
        >
          <PlusIcon class="size-6"></PlusIcon>
          Add Status
        </button>
      </div>
    </div>
    <div
      name="data"
      class="w-full flex flex-col justify-center items-center px-6 bg-white rounded-2xl"
    >
      <table class="table rounded-3xl">
        <thead class="border-b-[1px] border-opacity-10 bg-gray-600 bg-opacity-20">
          <tr>
            <td>Id</td>
            <td class="w-3/5 border-r-[1px] border-opacity-10">
              <span :class="thead"
                ><ClipboardDocumentListIcon class="size-6" />
                <p>Name</p></span
              >
            </td>
            <td class="w-1/5 border-r-[1px] border-opacity-10">
              <span :class="thead"
                ><UserCircleIcon class="size-6" />
                <p>Description</p></span
              >
            </td>
            <td class="w-1/5">
              <span :class="thead"
                ><FireIcon class="size-6" />
                <p>Status</p></span
              >
            </td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(status, index) in store.statusList" :key="status.id">
            <td>{{ index + 1 }}</td>
            <td>{{ status.name }}</td>
            <td>{{ status.description }}</td>
            <td>
              <div
                class="rounded-md px-[8px] py-[2px] w-fit itbkk-status"
                :class="[colorStatus(status.color)]"
              >
                {{ status.name }}
              </div>
            </td>
            <td>{{ status.color }}</td>
            <td class="dropdown dropdown-bottom dropdown-end">
              <div tabindex="0" role="button" class="m-1">
                <EllipsisVerticalIcon class="itbkk-button-action size-6 hover:scale-150" />
              </div>
              <ul
                tabindex="0"
                class="dropdown-content z-0 menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li class="">
                  <a
                    @click="router.push({ name: 'editStatus', params: { id: status.id } })"
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
        </tbody>
      </table>
    </div>
  </div>
  <router-view></router-view>
</template>

<style></style>
