<script setup>
import router from '@/router/router'
import { ref } from 'vue'

const boardInfo = ref({})

const url = import.meta.env.VITE_BASE_URL

async function boardFetch() {
  try {
    const response = await fetch(`${url}boards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+localStorage.getItem('token')
      }
    })

    const data = await response.json()
    boardInfo.value = data
    //console.log(boardInfo.value[0])

    if (!response.ok && data.status !== 401) {
      throw new Error(`Error: ${response.statusText}`)
    }
  } catch (error) {
    console.log(error)
    router.push('/login')
  }
}
</script>

<template>
  <button class="bg-red-600" @click="boardFetch">click me</button>
</template>
