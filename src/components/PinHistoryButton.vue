<script setup lang="ts">
import { Button } from 'primevue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  userId: string | undefined
}>()

const router = useRouter()

const handleBackClick = () => {
  router.push(`/pin-history/${props.userId}`)
}
</script>

<template>
  <Button
    @click="handleBackClick"
    v-motion-slide-right
    severity="help"
    label="Pin History"
    icon="pi pi-history"
  ></Button>
</template>
<style lang="css" scoped>
Button {
  position: absolute;
  right: 10%;
  top: 3%;
}
</style>
