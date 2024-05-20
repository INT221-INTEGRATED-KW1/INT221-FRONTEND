<script setup>
import { onMounted, ref } from 'vue'
import Navbar from './components/Navbar.vue'
import { useTaskStore } from './store/store'
import { getMethod } from './lib/fetchAPI'

const store = useTaskStore()

const isAppReady = ref(false);

const initializeApp = async () => {
  // Perform any setup or async operations here
  await new Promise((resolve) => setTimeout(resolve, 200)); // Example delay

  // Set the flag to true after initialization
  isAppReady.value = true;
};


onMounted(async () => {
  // store.isLoading = true
  // setTimeout(() => {
  //   store.isLoading = false
  // }, 2000)
  initializeApp()
  try {
    store.taskList.splice(0, store.taskList.length)
    const taskRes = await getMethod('tasks')
    store.taskList.push(...taskRes.data)
  } catch (error) {
    console.error('Error fetching :', error.message)
  }

  if (store.statusList.length == 0) {
    try {
      const statusRes = await getMethod('statuses')
      store.statusList.splice(0, store.taskList.length)
      store.statusList.push(...statusRes.data)
    } catch (error) {
      console.error('Fail to get status', error)
    }
  }

  try {
    const limitresult = await getMethod('statusesLimit')
    store.limitSwitch = limitresult.data[0].statusLimit
    // console.log(store.limitSwitch);
  } catch (error) {
    console.error('Error fetching :', error.message)
  }
  // console.log(store.taskList)
  // console.log(store.statusList)
})



</script>

<template>
  <div
    v-if="store.isLoading"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white z-40"
  >
    <div class="loader"></div>
  </div>
  <router-view v-if="isAppReady"/>
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
