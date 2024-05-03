<script setup>
import { onBeforeMount, onBeforeUnmount, onMounted, onUnmounted } from 'vue'
import { getTask } from '@/lib/fetchAPI'
import { ref } from 'vue'
import router from '@/router/router'
import { formatStatus, colorStatus, onMountSetup } from '@/lib/util'
import { useRoute } from 'vue-router'
import { formatToLocalTime } from '@/lib/util'

const route = useRoute()
const taskDetail = ref({})
const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
onMounted(async () => {
  try {
    taskDetail.value = await onMountSetup()
  } catch (error) {
    throw error
  }
  // console.log(taskDetail.value)
})

const header = 'text-gray-900 text-opacity-50 font-semibold'
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-sm text-slate-900"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40 itbkk-button"
      @click="router.push(`/task`)"
    ></div>

    <div
      name="detail"
      class="fixed w-[640px] h-4/5 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center"
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
          </ul>
        </div>
        <div></div>
      </div>
      <div class="overflow-y-auto h-full m-12 my-0 mb-4">
        <span
          v-text="taskDetail.title"
          class="itbkk-title w-full h-auto text-2xl font-bold mb-4 break-words inline-block"
        ></span>

        <div class="grid grid-cols-4 gap-y-4 text-md items-center">
          <span :class="header"> Status </span>
          <div class="col-span-3">
            <p
              class="itbkk-status rounded-md px-[8px] py-[2px] w-fit"
              :class="colorStatus(taskDetail.status)"
            >
              {{ formatStatus(taskDetail.status) }}
            </p>
          </div>
          <span :class="header" class="col-span-1"> Assignees </span>
          <div class="itbkk-assignees col-span-3" :class="{ 'italic grey': !taskDetail.assignees }">
            {{ !taskDetail.assignees ? 'Unassigned' : taskDetail.assignees }}
          </div>
          <span :class="header" class="col-span-1"> Timezone </span>
          <div v-text="timezone" class="itbkk-timezone col-span-3"></div>
          <span :class="header" class="col-span-1">CreateOn</span>
          <div v-text="taskDetail.createdOn" class="itbkk-created-on col-span-3"></div>
          <span :class="header" class="col-span-1">UpdateOn</span>
          <div v-text="taskDetail.updatedOn" class="itbkk-updated-on col-span-3"></div>
        </div>
        <div class="w-full flex flex-col gap-2">
          <span :class="header" class="w-full divider divider-start">Description</span>
          <p
            class="itbkk-description w-full text-g break-words inline-block"
            :class="{ 'italic text-grey-300': !taskDetail.description }"
          >
            {{ !taskDetail.description ? 'No Description Provided' : taskDetail.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

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

.slide-in-fwd-center {
  -webkit-animation: slide-in-fwd-center 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: slide-in-fwd-center 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@-webkit-keyframes slide-in-fwd-center {
  0% {
    -webkit-transform: translateZ(-1400px);
    transform: translateZ(-1400px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    opacity: 1;
  }
}
@keyframes slide-in-fwd-center {
  0% {
    -webkit-transform: translateZ(-1400px);
    transform: translateZ(-1400px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    opacity: 1;
  }
}
</style>
