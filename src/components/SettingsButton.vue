<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SpeedDial from 'primevue/speeddial'
import { Button } from 'primevue'
import { useRouter } from 'vue-router'

const router = useRouter()

const clickedClose = () => {
  emit('clickedEdit')
}

const clickedMap = () => {
  emit('clicked-map')
}

const clickedPin = () => {
  emit('clicked-pin')
}

const emit = defineEmits<{
  (event: 'clickedEdit'): void
  (event: 'clicked-map'): void
  (event: 'clicked-pin'): void
}>()

const menuItems = ref([
  {
    label: 'Map',
    icon: 'pi pi-map',
    command: () => Promise.resolve(clickedMap()),
  },
  {
    label: 'Pin Filter',
    icon: 'pi pi-thumbtack',
    command: () => Promise.resolve(clickedPin()),
  },
])

const props = defineProps({
  areaPermissions: {
    type: Boolean,
    default: false,
  },
})

const areaMenuEntry = {
  label: 'Edit Area',
  icon: 'pi pi-pen-to-square',
  command: () => Promise.resolve(clickedClose()),
}

const addAreaPermission = () => {
  if (
    props.areaPermissions === true &&
    !menuItems.value.find((entry) => entry.label === areaMenuEntry.label)
  ) {
    menuItems.value.push(areaMenuEntry)
  }
}

const clickCallback = (toggleCallback: Function) => {
  toggleCallback()
  addAreaPermission()
}
</script>

<template>
  <SpeedDial
    :model="menuItems"
    direction="up"
    style="position: absolute; bottom: calc(10% - 2rem); right: calc(10% - 1rem)"
    class="floatin-button"
  >
    <template #button="{ toggleCallback }">
      <Button
        class="pi p-button-rounded p-button-animated shadow-button"
        @click="clickCallback(toggleCallback)"
        style="padding: 10px"
        v-motion-slide-right
      >
        <i class="pi pi-cog"></i>
      </Button>
    </template>
  </SpeedDial>
</template>

<style>
.floating-button {
  z-index: 1200;
}
</style>
