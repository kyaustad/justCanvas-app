<script setup lang="ts">
import { Button } from 'primevue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBackClick = () => {
  router.back()
}
</script>

<template>
  <Button
    @click="handleBackClick"
    v-motion-slide-left
    severity="secondary"
    label="Back"
    icon="pi pi-arrow-circle-left"
  ></Button>
</template>
<style lang="css" scoped>
Button {
  position: absolute;
  left: 10%;
  top: 3%;
}
</style>
