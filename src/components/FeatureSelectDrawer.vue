<script setup lang="ts">
import type { Pin } from '../types/pin'
import type { Area } from '../types/area'
import { Drawer, Button, useToast, useConfirm } from 'primevue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { usePinStore } from '../stores/pinStore'
import { useAreaStore } from '../stores/areaStore'
import { useUsersStore } from '../stores/usersStore'

const router = useRouter()
const pinStore = usePinStore()
const areaStore = useAreaStore()
const usersStore = useUsersStore()
const confirm = useConfirm()
const toast = useToast()

const isVisible = ref(false)

const toggleDrawerVisible = () => {
  isVisible.value = !isVisible.value
}

defineExpose({
  toggleDrawerVisible,
})

const props = defineProps<{
  selectedPin: Pin | undefined
  selectedArea: Area | undefined
  mode: 'Pin' | 'Area'
}>()

const emit = defineEmits<{
  (event: 'edit-area'): void
}>()

const handleViewClick = async () => {
  if (props.mode === 'Pin') {
    pinStore.selectedPin = props.selectedPin
    router.push(`/pin/${props.selectedPin?._id}`)
  } else if (props.mode === 'Area') {
    areaStore.selectedArea = await areaStore.fetchSingleArea(props.selectedArea?._id)
    await usersStore.fetchAllUsersInActiveOffice()
    console.log('Selected AREA:', areaStore.selectedArea)
    toggleDrawerVisible()
    emit('edit-area')
  }
}

const confirmDeletePin = () => {
  confirm.require({
    message: 'Are you sure you want to delete this pin?',
    header: 'Delete?',
    icon: 'pi pi-trash',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    rejectIcon: 'pi pi-times-circle',
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    acceptIcon: 'pi pi-trash',
    accept: async () => {
      const success = await pinStore.deletePin(props.selectedPin?._id)

      if (!success) {
        toast.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'There was a problem deleting the pin!',
          life: 2500,
        })
        return
      }

      toast.add({
        severity: 'secondary',
        summary: 'Deleted!',
        detail: 'Deleted Pin!',
        life: 2500,
      })
    },
    reject: () => {},
  })
}

const confirmDeleteArea = () => {
  confirm.require({
    message: 'Are you sure you want to delete this area?',
    header: 'Delete?',
    icon: 'pi pi-trash',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    rejectIcon: 'pi pi-times-circle',
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    acceptIcon: 'pi pi-trash',
    accept: async () => {
      const success = await areaStore.deleteArea(props.selectedArea?._id)

      if (!success) {
        toast.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'There was a problem deleting the area!',
          life: 2500,
        })
        return
      }

      toast.add({
        severity: 'secondary',
        summary: 'Deleted!',
        detail: 'Deleted Area!',
        life: 2500,
      })
    },
    reject: () => {},
  })
}

const handleDeleteClick = () => {
  toggleDrawerVisible()
  if (props.mode === 'Pin') {
    confirmDeletePin()
  } else if (props.mode === 'Area') {
    confirmDeleteArea()
  }
}
</script>

<template>
  <Drawer
    v-model:visible="isVisible"
    :header="mode === `Pin` ? `Pin` : `Area`"
    position="top"
    style="height: auto"
  >
    <div class="option-container">
      <Button @click="handleDeleteClick" icon="pi pi-trash" severity="danger" label="Delete" />
      <Button @click="handleViewClick" severity="info" icon="pi pi-pen-to-square" label="Edit" />
    </div>
  </Drawer>
</template>
