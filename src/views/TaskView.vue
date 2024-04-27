<script setup>
import { onMounted, ref } from 'vue'
import { getTask } from '../lib/fetchAPI'
import router from '@/router/router'
import { formatStatus } from '@/lib/util'
import { useRoute } from 'vue-router'
import { ClipboardDocumentListIcon, FireIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { colorStatus } from '@/lib/util'
const route = useRoute()
const taskList = ref([])
onMounted(async () => {
  try {
    const taskRes = await getTask('tasks')
    taskList.value = taskRes.data
  } catch (error) {
    console.error('Error fetching tasks:', error.message)
  }
})

const thead = ref(
  'h-full flex flex-row items-center gap-[4px] text-sm font-semibold text-black opacity-80'
)
</script>

<template>
  <div class="w-lvw h-lvh p-24 flex flex-col gap-4 font-sans text-slate-900 bg-white">
    <div class="w-full h-28 font-bold text-4xl flex flex-col justify-center gap-1">
      <h1>IT-Bangmod Kradan Kanban</h1>
      <h2 class="text-3xl"></h2>
      <p class="text-base font-medium text-slate-700">Do something better than do nothing .</p>
    </div>
    <div name="data" class="w-full flex flex-col justify-center items-center px-6">
      <table class="table">
        <thead class="border-b-[1px] border-opacity-10">
          <tr>
            <td class="border-r-[1px] border-opacity-10">
              <span :class="thead"
                ><ClipboardDocumentListIcon class="size-6" />
                <p>Title</p></span
              >
            </td>
            <td class="border-r-[1px] border-opacity-10">
              <span :class="thead"
                ><UserCircleIcon class="size-6" />
                <p>Assignees</p></span
              >
            </td>
            <td>
              <span :class="thead"
                ><FireIcon class="size-6" />
                <p>Status</p></span
              >
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in taskList"
            :key="task.id"
            class="hover:cursor-pointer hover:bg-gray-300 hover:bg-opacity-20 transition duration-75 itbkk-item "
            @click="router.push(`/task/${task.id}`)"
          >
            <td v-text="task.title" class="itbkk-title border-r-[1px] border-opacity-10"></td>
            <td
              :class="{ 'italic grey': !task.assignees, 'itbkk-assignees': !route.params.id }"
              class="border-r-[1px]"
            >
              {{ !task.assignees ? 'Unassigned' : task.assignees }}
            </td>
            <td>
              <div
                class="rounded-md px-[8px] py-[2px] w-fit itbkk-status"
                :class="colorStatus(task.status)"
              >
                {{ formatStatus(task.status) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <router-view></router-view>
</template>

<style></style>
