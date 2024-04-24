<template>
    <div name="detail" class="border bg-sky-200 flex flex-col">
        <p>title : <span v-text="taskDetail.title"></span></p>
        <p>desc : <span v-text="taskDetail.description"></span></p>
        <p>assignees : <span v-text="taskDetail.assignees"></span></p>
        <p>status : <span v-text="taskDetail.status"></span></p>
        <p>createOn : <span v-text="taskDetail.createdOn"></span></p>
        <p>updateOn : <span v-text="taskDetail.updatedOn"></span></p>
    </div>
</template>

<script setup>


import { onMounted, onUpdated, ref } from 'vue'
import { getTask } from '@/lib/fetchAPI';

const props = defineProps({
  taskId: { type: Number, require: true }
})

const taskDetail = ref(null)
onUpdated(async () => {
  try {
    const taskRes = await getTask(`tasks/${props.taskId}`)
    taskDetail.value = taskRes.data
    console.log(taskDetail.value)
    console.log(taskDetail.value.title);
  } catch (error) {
    console.error('Error fetching tasks:', error.message)
  }
})
</script>

<style></style>
