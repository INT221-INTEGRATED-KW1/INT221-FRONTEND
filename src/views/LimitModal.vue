<script setup>
import { useTaskStore } from '@/store/store'
import { computed, ref, watch } from 'vue'
import router from '@/router/router'
import { RouterLink, useRoute } from 'vue-router'

const store = useTaskStore()
const route = useRoute()

function goBack(isClear) {
  if (isClear) {
    store.limitSwitch = false
    router.push({ name: route.matched[0].name }).then(() => {
      location.reload()
    })
  } else {
    router.push({ name: route.matched[0].name })
  }
}

function validateInput() {
  return store.maxTask > 10
}

function isLimitSwitch() {
  return store.limitSwitch
}

function confirmLimit() {
  store.statusList.forEach((status, index) => {
    if (status.noOfTasks <= store.maxTask || status.noOfTasks > store.maxTask) {
      if (status.name != 'No Status' && status.name != 'Done') {
        store.limitTrigger = true
        store.limitInfo.push({ id: status.id, name: status.name, count: status.noOfTasks })
      }
    }
  })
  goBack(false)
}
</script>

<template>
  <div
    class="itbkk-modal-setting fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-sm bg-black bg-opacity-40 text-slate-900"
  >
    <!-- Task text block -->
    <div
      name="detail"
      class="fixed w-[640px] h-auto p-8 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center justify-center"
    >
      <h1 class="w-full text-left font-semibold text-xl">Status Setting</h1>
      <div class="divider"></div>
      <p class="w-full text-left text-lg break-words inline-block">
        Users can limit the number of task in a status by setting the Maximum tasks in each status
        (except "No Status" and "Done" statuses).
      </p>
      <br />

      <!-- Task function block -->
      <div class="itbkk-limit-task flex flex-row">
        <input type="checkbox" class="toggle" v-model="store.limitSwitch" checked />
        <p class="ml-5"><b>Limit task in this status</b></p>
      </div>
      <!-- <div class="itbkk-max-task flex flex-row">
        <p class="mr-5 mt-3"><b>Maximum tasks</b></p>
        <input
          type="text"
          maxlength="2"
          class="input input-bordered w-full max-w-xs"
          v-model="store.maxTask"
        />
      </div> -->
      <br />

      <!-- Over maximum task limit alert -->
      <div v-if="validateInput()" role="alert" class="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Task limit should not be over 10!</span>
      </div>

      <!-- On limit enable alert -->
      <div v-if="isLimitSwitch()" role="alert" class="alert alert-success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>The kanban board now limits 10 tasks in each status.</span>
      </div>

      <!-- On limit disable alert -->
      <div v-if="!isLimitSwitch()" role="alert" class="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>The kanban board has disabled the task limit in each status.</span>
      </div>

      <div class="divider"></div>

      <!-- Button function block -->
      <div class="w-full flex flex-row gap-4 justify-center items-center mt-2">
        <button
          class="itbkk-button-confirm btn bg-green-600 text-white px-8"
          :disabled="validateInput()"
          @click="confirmLimit()"
        >
          Save
        </button>
        <button class="itbkk-button-cancel btn bg-red-600 text-white px-8" @click="goBack(true)">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
