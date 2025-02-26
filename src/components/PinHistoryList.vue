<script setup lang="ts">
import { ScrollPanel } from 'primevue'
import SinglePinListItem from './SinglePinListItem.vue'
import { onMounted, ref, watch } from 'vue'
import type { Pin } from '../types/pin'

const props = defineProps<{
  userPins: Pin[]
}>()
const pins = ref<Pin[]>([])
const pinDeleted = () => {
  emit('pin-deleted')
}

const emit = defineEmits<{
  (event: 'pin-deleted'): void
}>()

onMounted(() => {
  pins.value = props.userPins
})
</script>

<template>
  <ScrollPanel style="width: 100%; height: 100%">
    <SinglePinListItem
      @pin-deleted="pinDeleted"
      v-for="pin in userPins"
      :key="pin._id"
      :pin="pin"
    />
  </ScrollPanel>
</template>
