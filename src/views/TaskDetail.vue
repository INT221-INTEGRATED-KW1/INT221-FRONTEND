<template>
  <div class="fixed top-0 left-0 w-full h-full flex justify-center items-center">
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-50  itbkk-button backdrop-blur-sm"
      @click="router.push(`/task`)"
    ></div>
    <div name="detail" class="fixed w-3/5 h-3/5 border p-8 bg-sky-200 flex flex-col indicator">
      <!-- rotate-in-center -->
      <p>title : <span v-text="taskDetail.title" class="itbkk-title"></span></p>
      <p>
        desc :
        <span class="itbkk-description" :class="{ 'italic grey': !taskDetail.description }">{{
          !taskDetail.description ? 'No Description Provided' : taskDetail.description
        }}</span>
      </p>
      <p>
        assignees :
        <span class="itbkk-assignees" :class="{ 'italic grey': !taskDetail.assignees}"
          >{{ !taskDetail.assignees ? 'Unassigned' : taskDetail.assignees }}</span
        >
      </p>
      <p>
        status :
        <span
          class="itbkk-status"
          :class="{ 'italic grey': !taskDetail.status }"
          >{{ !taskDetail.status ? 'No Status' : taskDetail.status }}</span
        >
      </p>
      <p>timezone : <span v-text="timezone" class="itbkk-timezone"></span></p>
      <p>createOn : <span v-text="createDate" class="itbkk-created-on"></span></p>
      <p>updateOn : <span v-text="updateDate" class="itbkk-updated-on"></span></p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { getTask } from '@/lib/fetchAPI'
import { ref } from 'vue'
import router from '@/router/router'
import { formatStatus } from '@/lib/util'

const taskDetail = ref({})
const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const createDate = ref(null)
const updateDate = ref(null)
onMounted(async () => {
  const id = router.currentRoute.value.params.id
  try {
    const taskRes = await getTask(`tasks/${id}`)
    taskDetail.value = taskRes.data
    taskDetail.value.status = formatStatus(taskDetail.value.status)
    createDate.value = formatToLocalTime(taskDetail.value.createdOn)
    updateDate.value = formatToLocalTime(taskDetail.value.updatedOn)
  } catch (error) {
    router.push('/task')
  }
})

function formatToLocalTime(timeStr) {
  const inputTime = new Date(timeStr)
  const formattedTime = inputTime
    .toLocaleString("en-GB")
    .replace('T', ' ')
  return formattedTime
}


</script>

<style>
.rotate-in-center {
  -webkit-animation: rotate-in-center 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: rotate-in-center 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@-webkit-keyframes rotate-in-center {
  0% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
    opacity: 0;
  }
  100% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
    opacity: 1;
  }
}
@keyframes rotate-in-center {
  0% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
    opacity: 0;
  }
  100% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
    opacity: 1;
  }
}
</style>
