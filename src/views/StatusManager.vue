<script setup>
import { ref } from 'vue'
import router from '@/router/router'
import { formatStatus, colorStatus } from '@/lib/util'
import {
  ClipboardDocumentListIcon,
  FireIcon,
  PlusIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'

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
            <li>Edit</li>
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
      </table>
    </div>
  </div>
</template>

<style></style>
