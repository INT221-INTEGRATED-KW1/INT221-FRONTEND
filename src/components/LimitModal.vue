<script setup>
import { useTaskStore } from '@/store/store'
import { ref } from 'vue'
import router from '@/router/router'
import { useRoute } from 'vue-router'
import { patchMethod, updateMethod } from '@/lib/fetchAPI'

const store = useTaskStore()
const route = useRoute()
const updatedEnableLimit = ref(store.limitSwitch)

function validateInput() {
  return store.maxTask > 10
}

const isHaveLimitTask = ref(false)
async function confirmLimit() {
  const obj = { limitMaximumStatus: updatedEnableLimit.value }
  let result
  try {
    result = await patchMethod('maximum-status', obj)
    if (result.resCode == '200') {
      store.limitSwitch = result.data.statusLimit
      if (result.resCode == '403') router.push({ name: 'forbidden' })
      if (!result.data.statuses || result.data.statuses.length == 0) {
        goBack()
        store.ToastMessage = {
          msg: updatedEnableLimit.value
            ? `The kanban board now limits 10 tasks in each status.`
            : `The kanban board has disabled the task limit in each status.`,
          color: updatedEnableLimit.value ? 'lime' : 'amber'
        }
      } else if (result.data.statuses) {
        store.limitInfo = result.data.statuses
        isHaveLimitTask.value = true
      }
    }
  } catch (error) {
    console.error('Fail to limit status', error)
  }
}

function goBack() {
  if (isHaveLimitTask.value) {
    store.ToastMessage = {
      msg: `The kanban board now limits 10 tasks in each status.`,
      color: 'lime'
    }
  }
  return router.push({ name: route.matched[0].name })
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
      v-if="!isHaveLimitTask"
    >
      <h1 class="w-full text-left font-semibold text-xl">Status Setting</h1>
      <div class="divider"></div>
      <p class="w-full text-left text-lg break-words inline-block">
        Users can limit the number of task in a status by setting the Maximum tasks in each status
        (except "No Status" and "Done" statuses).
      </p>
      <br />

      <!-- Task function block -->
      <div class="flex flex-row">
        <input
          type="checkbox"
          class="itbkk-limit-task toggle"
          v-model="updatedEnableLimit"
          :checked="updatedEnableLimit"
        />
        <p class="ml-5"><b>Limit task in this status</b></p>
      </div>
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
      <div v-if="updatedEnableLimit" role="alert" class="alert alert-success">
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
      <div v-if="!updatedEnableLimit" role="alert" class="alert alert-warning">
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
          :disabled="updatedEnableLimit == store.limitSwitch"
          @click="confirmLimit()"
        >
          Save
        </button>
        <button class="itbkk-button-cancel btn bg-red-600 text-white px-8" @click="goBack()">
          Cancel
        </button>
      </div>
    </div>


    <!-- Have limit task when enable -->
    <div
      name="detail"
      class="fixed w-[640px] h-auto p-8 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center justify-center"
      v-if="isHaveLimitTask"
    >
      <img src="/public/caution.png" alt="" class="size-24 mx-auto" />
      <h1 class="w-full text-center font-semibold text-xl">Limit Task</h1>
      <ul class="list-none list-inside w-full">
        <li v-for="(status, index) in store.limitInfo" :key="index" v-show="!['No Status', 'Done'].includes(status.name)">
          {{ status.name }} ( {{ status.noOfTasks }} )
        </li>
      </ul>
      <p class="w-full">
        These statuses that have reached the task limit. No additional tasks can be added to these
        statuses at this time.
      </p>
      <div class="w-full flex flex-row gap-4 justify-center items-center mt-2">
        <button class="itbkk-button-cancel btn bg-lime-300 px-8" @click="goBack()">OK</button>
      </div>
    </div>
  </div>
</template>

<style></style>
