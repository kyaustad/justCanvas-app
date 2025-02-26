<script setup lang="ts">
import type { Area } from '../types/area'
import type { User } from '../types/user'
import { Drawer, Button, useToast, useConfirm, MultiSelect } from 'primevue'
import { ref } from 'vue'

import { useAreaStore } from '../stores/areaStore'
import { useUsersStore } from '../stores/usersStore'

const areaStore = useAreaStore()
const usersStore = useUsersStore()
const confirm = useConfirm()
const toast = useToast()

interface NewArea {
  _id?: string
  type: 'Polygon'
  geometry: {
    type: 'Polygon'
    coordinates: Array<Array<Array<number>>>
  }
  owners?: User[] | string[]
  office: string
}

const isVisible = ref(false)
const newArea = ref<NewArea>({
  _id: areaStore.selectedArea?._id || '',
  type: 'Polygon',
  geometry: {
    type: 'Polygon',
    coordinates: areaStore.selectedArea?.geometry.coordinates || [[[]]],
  },
  office: areaStore.selectedArea?.office || '',
  owners: areaStore.selectedArea?.owners
    ? areaStore.selectedArea.owners
        .map((owner) => (typeof owner === 'object' && '_id' in owner ? owner._id : owner))
        .filter((id): id is string => Boolean(id))
    : [],
})

const toggleDrawerVisible = () => {
  isVisible.value = !isVisible.value
}

defineExpose({
  toggleDrawerVisible,
})

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
      const success = await areaStore.deleteArea(areaStore.selectedArea?._id)

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
      toggleDrawerVisible()
    },
    reject: () => {},
  })
}

const getFullName = (option: User) => {
  return `${option.firstName} ${option.lastName}`
}

const handleShow = () => {
  newArea.value = {
    _id: areaStore.selectedArea?._id || '',
    type: 'Polygon',
    geometry: {
      type: 'Polygon',
      coordinates: areaStore.selectedArea?.geometry.coordinates || [[[]]],
    },
    office: areaStore.selectedArea?.office || '',
    owners: areaStore.selectedArea?.owners
      ? areaStore.selectedArea.owners
          .map((owner) => (typeof owner === 'object' && '_id' in owner ? owner._id : owner))
          .filter((id): id is string => Boolean(id))
      : [],
  }
}

const handleUpdateArea = async () => {
  const success = await areaStore.updateArea(newArea.value as Area)
  if (success) {
    toast.add({
      severity: 'secondary',
      summary: 'Updated!',
      detail: 'Updated Area!',
      life: 2500,
    })
    toggleDrawerVisible()
  } else if (!success) {
    toast.add({
      severity: 'error',
      summary: 'Error!',
      detail: 'Error Updating Area!',
      life: 2500,
    })
  }
}
</script>

<template>
  <Drawer
    @show="handleShow"
    v-model:visible="isVisible"
    header="Area"
    position="bottom"
    style="height: auto"
  >
    <div class="form-group">
      <h3>Assigned To:</h3>
      <MultiSelect
        placeholder="Select Assigned Users"
        filter
        v-model="newArea.owners"
        :options="usersStore.allUsers"
        optionValue="_id"
        :optionLabel="getFullName"
      />
    </div>
    <div class="option-container">
      <Button @click="confirmDeleteArea" icon="pi pi-trash" severity="danger" label="Delete" />
      <Button @click="handleUpdateArea" severity="success" icon="pi pi-save" label="Save" />
    </div>
  </Drawer>
</template>
