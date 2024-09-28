<script setup>
import router from '@/router/router';

function goback() {
    if(localStorage.getItem('refresh_token')) {
        router.push({name: 'board'})
    }else{ router.push({name: 'login'})}
}
</script>

<template>
  <div class="flex flex-col justify-center items-center h-screen">
        <img src="/public/error-404.png" class="size-48 m-4 grayscale">
        <span class="text-6xl font-bold">404</span>
        <span class="text-2xl font-semibold">Page not found</span>        
        <span class="text-lg">Dont give up to find the right path url naja <3</span>
        <span class="font-semibold hover:underline hover:cursor-pointer" @click="goback()">Back to the page</span>
    </div>
</template>

<style>

</style>