<template>
    <div name="detail" class="border bg-sky-200 flex flex-col">
        <p>title : <span v-text="taskDetail.title"></span></p>
        <p>desc : <span v-text="taskDetail.description" class="text-wrap"></span></p>
        <p>assignees : <span v-text="taskDetail.assignees"></span></p>
        <p>status : <span v-text="taskDetail.status"></span></p>
        <p>createOn : <span v-text="taskDetail.createdOn"></span></p>
        <p>updateOn : <span v-text="taskDetail.updatedOn"></span></p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  taskDetail: { type: Object, required: true }
})

</script>

<style></style>
