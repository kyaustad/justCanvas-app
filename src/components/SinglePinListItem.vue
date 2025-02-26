<script setup lang="ts">
import { pinGreen, pinRed, pinYellow, pinBlack, pinBlue, pinGray } from '../assets/icons'
import { Button, useToast, useConfirm } from 'primevue'
import { useRouter } from 'vue-router'
import { usePinStore } from '../stores/pinStore'

import type { Pin } from '../types/pin'

const router = useRouter()
const pinStore = usePinStore()
const confirm = useConfirm()
const toast = useToast()

const props = defineProps<{
  pin: Pin
}>()

const emit = defineEmits<{
  (event: 'pin-deleted'): void
}>()

const pinDeleted = () => {
  emit('pin-deleted')
}

const pinMap: Record<string, string> = {
  'Not Interested': pinRed,
  Sale: pinGreen,
  Pitched: pinBlue,
  'Not Home': pinGray,
  'No Knock': pinBlack,
  'Go Back': pinYellow,
}

const pinColorMap: Record<string, string> = {
  'Not Interested': 'orangered',
  Sale: 'green',
  Pitched: 'darkturquoise',
  'Not Home': 'slategray',
  'No Knock': 'black',
  'Go Back': 'yellow',
}

const handleEditPinClicked = (id: string | undefined) => {
  if (id) {
    pinStore.selectedPin = props.pin
    router.push(`/pin/${id}`)
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
      const success = await pinStore.deletePin(props.pin?._id)

      if (!success) {
        toast.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'There was a problem deleting the pin!',
          life: 2500,
        })
        return
      }
      pinDeleted()
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
</script>

<template>
  <div class="pin-entry">
    <div class="entry-background">
      <div class="info-container" v-motion-pop-visible>
        <div class="entry-container">
          <img :src="pinMap[pin.type]" />
          <div class="text-container">
            <h3 :style="{ color: pinColorMap[pin.type] }">{{ pin.type }}</h3>
            <p>{{ new Date(pin.createdAt || Date.now()).toLocaleString() || `` }}</p>
          </div>
        </div>
        <div class="button-container">
          <Button @click="confirmDeletePin" severity="danger" icon="pi pi-trash" />
          <Button
            @click="handleEditPinClicked(pin._id)"
            severity="info"
            icon="pi pi-pen-to-square"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
