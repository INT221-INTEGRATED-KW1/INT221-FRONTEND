<script setup>
import { updateMethod } from '@/lib/fetchAPI'
import { formatStatusReverse, onMountSetup , colorStatus , statusColors} from '@/lib/util'
import router from '@/router/router'
import { useTaskStore } from '@/store/store'
import { compile, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useTaskStore()
const id = router.currentRoute.value.params.id

const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const date = ref(new Date().toLocaleString('en-GB').replace('T', ' '))

const statusDetail = ref({})
let oldDetail = {}
const updateDetail = ref({})

onMounted(async () => {
  try {
    statusDetail.value = await onMountSetup('statuses')
    store.errorRes = (await statusDetail.value.getMode) ?? 'Done'
    oldDetail = JSON.parse(JSON.stringify(statusDetail.value))
    updateDetail.value = statusDetail.value
    console.log(statusDetail.value)
    console.log(store.errorRes)
    // console.log('done');
  } catch (error) {
    statusDetail.value = {}
    throw error
  }
})

const isInValid = ref(false)

const isSameDetail = computed(() => {
  // console.log('old : ' , JSON.stringify(oldDetail));
  // console.log('update : ' , JSON.stringify(updateDetail.value));
  return JSON.stringify(oldDetail) === JSON.stringify(updateDetail.value)
})

async function editStatus() {
  store.resStatus = ''
  isInValid.value = false
  if (isSameDetail.value) {
    console.log('same');
    return router.push({name: 'status'})
  }
  if (!updateDetail.value.name) {
    return (isInValid.value = true)
  } else {
    updateDetail.value = {
      id: updateDetail.value.id,
      name: updateDetail.value.name.trim(),
      description: updateDetail.value.description ?? null,
      color: updateDetail.value.color
    }
    // console.log(updateDetail.value);
    // let addtask function and send out info into the main page :D
    try {
      const result = await updateMethod(statusDetail.value.id, 'statuses', updateDetail.value)
      const index = store.statusList.findIndex((status) => status.id == result.data.id)
      // console.log(result.data);
      // console.log(store.statusList[index]);
      Object.assign(store.statusList[index], result.data)
      store.resStatus = 'editDone'
      router.push({name: 'status'})
    } catch (error) {
      isInValid.value = true
      setTimeout(() => {
        isInValid.value = false
      }, 8000);
      store.resStatus = 'updateError'
      throw console.error('error : ', error);
    }
    router.push({name: 'status'})
  }
}

const inputField = 'p-2 col-span-3 hover:bg-slate-400 hover:bg-opacity-20 duration-150 rounded-md'
const header = 'text-gray-900 text-opacity-50 font-semibold'
</script>
<template>
  <div
    v-if="Object.keys(statusDetail).length !== 0 && store.errorRes == 'Done'"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center font-sans text-md text-slate-900"
  >
    <div
      name="backdrop"
      class="w-lvw h-lvh bg-black bg-opacity-40"
      @click="router.push({name: 'status'})"
    ></div>

    <div
      name="detail"
      class="fixed w-[640px] h-[55%] bg-white flex flex-col gap-4 rounded-xl slide-in-fwd-center"
    >
      <div class="w-auto flex flex-row justify-between m-12 mb-0 font-bold text-2xl">
        <div>Edit your status Right now!!!!</div>
      </div>
      <div v-if="isInValid" class="kbd kbd-md mx-12 bg-red-300">
        Status {{ updateDetail.name }} is already existed.
      </div>
      <div class="w-full h-2/6 flex justify-center items-center py-auto">
        <div
          class="rounded-md px-[8px] py-[2px] w-fit h-fit min-h-8 text-xl"
          :class="[colorStatus(updateDetail.color)]"
        >
          {{ !updateDetail.name ? 'Status' : updateDetail.name }}
        </div>
      </div>
      <div class="overflow-y-auto h-full m-12 my-0 mb-4">
        <div class="w-full flex flex-col gap-2">
          <span class="w-full divider divider-start"><b>Name</b></span>
          <input
            type="text"
            placeholder="Unname"
            maxlength="50"
            v-model="updateDetail.name"
            class="itbkk-status-name w-full p-2 rounded-md hover:bg-gray-500 hover:bg-opacity-20"
          />
        </div>
        <div class="w-full flex flex-col gap-2">
          <span class="w-full divider divider-start"><b>Description</b></span>
          <textarea
            placeholder="Add some status ..."
            maxlength="50"
            v-model="updateDetail.description"
            class="itbkk-status-description w-full h-24 p-2 rounded-md hover:bg-gray-500 hover:bg-opacity-20"
          ></textarea>
        </div>
        <span class="w-full divider divider-start"><b>Color</b></span>
        <div class="grid grid-cols-6 wrap gap-4 m-6">
          <label
            v-for="(colorClass, colorName) in statusColors"
            :key="colorName"
            class="cursor-pointer pr-0"
          >
            <input
              type="radio"
              class="peer sr-only"
              name="color"
              v-model="updateDetail.color"
              :value="colorName"
            />
            <div
              class="size-10 rounded-md py-auto ring-2 ring-transparent transition-all hover:shadow peer-checked:text-sky-600 peer-checked:ring-blue-400 peer-checked:ring-offset-2 text-center content-center"
              :class="[colorClass]"
            >
              <!-- {{ colorName }} -->
            </div>
          </label>
        </div>
      </div>

      <div class="mb-12 flex justify-center gap-4">
        <button
          @click="editStatus()"
          class="itbkk-button-confirm btn bg-green-400"
          :disabled="!updateDetail.name"
        >
          Save
        </button>
        <button @click="router.push('/status/manage')" class="itbkk-button-cancel btn bg-grey-400">
          Cancel
        </button>
      </div>
    </div>
  </div>
  <!-- <ErrorModal v-if="store.errorRes != 'done'"></ErrorModal> -->
</template>
<style></style>
