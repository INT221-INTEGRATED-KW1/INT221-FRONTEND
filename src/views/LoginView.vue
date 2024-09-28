<script setup>
import router from '@/router/router'
import { onMounted, ref } from 'vue'
import { JwtDecode } from '@/lib/util';

const url = import.meta.env.VITE_BASE_URL
const authAlert = ref('')
const serverAlert = ref('')
const msgAlert = ref('')
const uname = ref('')
const paswd = ref('')

async function loginFetch() {
  try {
    const response = await fetch(`${url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: uname.value,
        password: paswd.value
      })
    })

    const data = await response.json()

    if (!response.ok && data.status !== 401) {
      throw new Error(`Error: ${response.statusText}`)
    }

    if (data.status === 401) {
      authAlert.value = true
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      msgAlert.value = data.message + '.'
    } else {
      const decodeData = JwtDecode(data.access_token)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('username', decodeData.name)
      localStorage.setItem('refresh_token', data.refresh_token)
      router.push({name: 'board'})
    }
  } catch (error) {
    serverAlert.value = true
    router.push('/login')
  }
}

onMounted(()=> {
  if (localStorage.getItem('token')) {
    router.push({name: 'board'})
  }
})
</script>

<template>
  <div v-if="authAlert">
    <div role="alert" class="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
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
      <span class="itbkk-message">{{ msgAlert }}</span>
    </div>
  </div>

  <div v-if="serverAlert">
    <div role="alert" class="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
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
      <span class="itbkk-message">There is a problem. Please try again later.</span>
    </div>
  </div>

  <div class="flex items-center justify-center w-full h-screen">
    <div class="card lg:card-side bg-white glass shadow-2xl">
      <figure>
        <img src="../../public/kanban.png" />
      </figure>
      <div class="card-body">
        <h1 class="card-title text-5xl">KANBAN</h1>
        <br />
        <p class="text-xs">Easier Work, Easier Life. Use Kanban</p>
        <div class="divider divider-info"></div>
        <div>
          <label class="itbkk-user input input-bordered flex items-center gap-2 bg-white">
            <input
              type="text"
              class="grow itbkk-username"
              placeholder="Username"
              maxlength="50"
              v-model="uname"
            />
          </label>
          <br />
          <label class="input input-bordered flex items-center gap-2 bg-white">
            <input
              type="password"
              class="grow itbkk-password"
              placeholder="Password"
              maxlength="14"
              v-model="paswd"
            />
          </label>
        </div>
        <br />
        <div class="card-actions justify-center">
          <button
            :disabled="!uname || !paswd"
            class="itbkk-button-signin btn btn-wide btn-circle bg-blue-500 text-white"
            :class="!uname || !paswd ? 'disabled' : ''"
            @click="loginFetch()"
          >
            Sign In
          </button>
        </div>
        <div class="card-actions justify-center">
          <button class="btn btn-wide btn-circle bg-purple-700 text-white">
            Sign in with Microsoft Team
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
