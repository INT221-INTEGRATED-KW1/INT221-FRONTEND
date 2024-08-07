<script setup>
import { useTaskStore } from '@/store/store'
import { ref, watch } from 'vue'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { statusColors } from '@/lib/util'
const store = useTaskStore()

watch(
  () => store.ToastMessage,
  () => {
    setTimeout(() => {
      store.ToastMessage.shift()
    }, 5000)
  },
  { deep: true }
)
</script>

<template>
  <div class="fixed top-4 w-full">
    <div class="flex flex-col gap-2"></div>
    <transition-group name="alert">
      <div
        v-for="item in store.ToastMessage"
        :key="item"
        role="alert"
        class="alert w-fit mx-auto"
        :class="statusColors[item.color]"
      >
        <CheckCircleIcon v-if="!item.erroricon" class="size-8" />
        <ExclamationTriangleIcon v-if="item.erroricon" class="size-8" />
        <span class="itbkk-message">{{ item.msg }}</span>
      </div>
    </transition-group>
  </div>
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
