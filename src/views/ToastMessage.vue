<script setup>
import { useTaskStore } from '@/store/store'
import { ref, watch } from 'vue'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { statusColors } from '@/lib/util'
const store = useTaskStore()
// console.log('a');
const isShowing = ref(false)

watch(
  () => store.ToastMessage,
  (newStatus) => {
    store.ToastMessage.color = statusColors[store.ToastMessage.color]
    if (newStatus) {
      isShowing.value = true
      setTimeout(() => {
        isShowing.value = false
      }, 5000)
    }
  }
)
</script>

<template>
  <transition name="alert">
    <div class="fixed top-4 w-full" v-if="isShowing">
      <div role="alert" class="alert w-fit mx-auto" :class="store.ToastMessage.color">
        <CheckCircleIcon v-if="!store.ToastMessage.erroricon" class="size-8"/>
        <ExclamationTriangleIcon v-if="store.ToastMessage.erroricon" class="size-8"/>
        <span class="itbkk-message">{{ store.ToastMessage.msg }}</span>
        <!-- <XMarkIcon class="size-8 hover:scale-125" @click="store.resStatus = ''"></XMarkIcon> -->
      </div>
    </div>
  </transition>
</template>

<style>
.alert-enter-active,
.alert-leave-active {
  animation: slide-bottom 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}

.alert-enter,
.alert-leave-to {
  animation: slide-top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
}
</style>
