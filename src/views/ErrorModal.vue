<script setup>
import { useTaskStore } from '@/store/store'
import { computed, ref, watch } from 'vue'
import router from '@/router/router'
import { useRoute } from 'vue-router'
const store = useTaskStore()
const route = useRoute()

function goBack() {
  store.isError = false
  router.push({ name: route.matched[0].name }).then(() => {
    location.reload()
  })
}
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-sm text-slate-900"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40 itbkk-button"
      @click="goBack()"
    ></div>
    <div
      name="detail"
      class="fixed w-[640px] h-auto p-8 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center justify-center"
    >
      <img src="/public/caution.png" alt="" class="size-24 mx-auto" />
      <h1 class="w-full text-center font-semibold text-xl">Something problem</h1>
      <p class="w-full text-center text-lg break-words inline-block itbkk-message">
        <span class="itbkk-message"><slot name="message"></slot></span>
      </p>
      <div class="w-full flex flex-row gap-4 justify-center items-center mt-2">
        <button class="itbkk-button-cancel btn bg-slate-300 px-8" @click="goBack()">Back</button>
      </div>
    </div>
  </div>
</template>

<style></style>
