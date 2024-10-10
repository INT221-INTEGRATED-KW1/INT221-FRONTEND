<script setup>
import { onMounted, ref } from 'vue'
import Navbar from './components/Navbar.vue'
import { useTaskStore } from './store/store'
import { getMethod } from './lib/fetchAPI'

const store = useTaskStore()

const isAppReady = ref(false)

const initializeApp = async () => {
  // Perform any setup or async operations here
  await new Promise((resolve) => setTimeout(resolve, 200)) // Example delay

  // Set the flag to true after initialization
  isAppReady.value = true
}

onMounted(async () => {
  initializeApp()
})
</script>

<template>
  <div
    v-if="store.isLoading"
    class=""
  >
    <div class="loader"></div>
  </div>
  <router-view v-if="isAppReady" />
</template>

<style>
.loader {
  width: 180px;
  height: 20px;
  background: linear-gradient(#1f1f1f 0 0) 0/0% no-repeat #ddd;
  animation: l1 2.1s ease-in-out;
}
@keyframes l1 {
  75% {
    background-size: 100%;
    opacity: 100%;
  }
  100% {
    background-size: 100%;
    opacity: 0%;
  }
}
</style>
