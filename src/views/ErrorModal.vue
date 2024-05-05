<script setup>
import { useTaskStore } from "@/store/store";
import { computed, ref, watch } from "vue";
import router from "@/router/router";

const store = useTaskStore()
const errorData = {
    detail:{
        message: "The requested task does not exist"
    },
    edit: {
        message: "The task does not exist",
    },
    delete:{
        message: "The task does not exist"
    },
}

function findMessage() {
  // console.log(store.errorRes);
    if (errorData.hasOwnProperty(store.errorRes)) {
        const obj = errorData[store.errorRes]
        return obj.message || "Message not found";
    } else {
        return "Status Done";
    }
}

const message = ref("")
setTimeout(() => { 
  message.value = findMessage()
  // console.log( message.value);
}, 50)

function goBack() {
  store.errorRes = 'Done'
  router.push('/task')
  // console.log(store.errorRes);
}

</script>

<template>
<div
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-sm text-slate-900"
    v-if="store.errorRes != 'Done'"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40 itbkk-button"
      @click="router.push('/task')"
    ></div>
    <div
      name="detail"
      class="fixed w-[640px] h-auto p-8 bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center justify-center"
    >
      <img src="/public/caution.png" alt="" class="size-24 mx-auto">
      <h1 class="w-full text-center font-semibold text-xl">Something problem</h1>
      <p class="itbkk-message w-full text-center text-lg break-words inline-block">
        {{ message ?? "" }}
      </p>
      <div class="w-full flex flex-row gap-4 justify-center items-center mt-2">
        <button class="itbkk-button-cancel btn bg-slate-300 px-8" @click="goBack()">
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<style>
</style>