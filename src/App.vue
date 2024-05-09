<template>
  <!-- <div class="h-screen flex flex-row"> -->
  <!-- <Navbar /> -->
  <div
    v-if="store.isLoading"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center"
  >
    <div class="loader"></div>
  </div>

  <router-view v-if="!store.isLoading" />
  <!-- </div> -->
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import { useTaskStore } from './store/store'

const store = useTaskStore()

onMounted(async () => {
  // store.isLoading = true
  // setTimeout(() => {
  //   store.isLoading = false
  // }, 3000)
})
</script>

<style>
.loader {
  width: 180px;
  height: 20px;
  background: linear-gradient(#1f1f1f 0 0) 0/0% no-repeat #ddd;
  animation: l1 3.1s ease-in-out;
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
