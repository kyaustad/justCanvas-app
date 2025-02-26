<script setup lang="ts">
import { Button } from 'primevue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  mode: 'teams' | 'users'
}>()

const router = useRouter()

const handleBackClick = () => {
  router.push(props.mode === 'teams' ? '/teams/add-team' : '/users/add-user')
}
</script>

<template>
  <Button
    @click="handleBackClick"
    v-motion-slide-right
    severity="contrast"
    label="Add"
    icon="pi pi-plus-circle"
  ></Button>
</template>
<style lang="css" scoped>
Button {
  position: absolute;
  right: 10%;
  top: 3%;
}
</style>
