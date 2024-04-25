<template>
  <p class="w-full bg-gray-500 text-white">This is TASK</p>
  <div name="data" class="w-full flex flex-col justify-center items-center">
    <table class="table w-4/6 mt-6">
      <thead>
        <tr>
          <td>Title</td>
          <td>Assignees</td>
          <td>Status</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="task in taskList"
          :key="task.id"
          class="hover:scale-105"
          @click="router.push(`/task/${task.id}`)"
        >
          <td v-text="task.title"></td>
          <td v-text="task.assignees"></td>
          <td v-text="task.status"></td>
        </tr>
      </tbody>
    </table>
  </div>
  <router-view></router-view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getTask } from '../lib/fetchAPI'
import TaskDetail from './TaskDetail.vue'
import router from '@/router/router';
const taskList = ref([])

onMounted(async () => {
  try {
    const taskRes = await getTask('tasks')
    taskList.value = taskRes.data
    // console.log(taskList.value)
  } catch (error) {
    console.error('Error fetching tasks:', error.message)
  }
})

// console.log(taskDetail.value.data);
</script>

<style>

</style>
