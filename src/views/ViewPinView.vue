<script setup lang="ts">
import HeaderBar from '../components/HeaderBar.vue'
import { pinGreen, pinRed, pinYellow, pinBlack, pinBlue, pinGray } from '../assets/icons'
import { Button, Toast, ConfirmDialog, InputText, Select, useConfirm, useToast } from 'primevue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import type { Pin } from '../types/pin'

import { usePinStore } from '../stores/pinStore'

const pinStore = usePinStore()
const confirm = useConfirm()
const toast = useToast()
const router = useRouter()

const defaultPin: Pin = {
  _id: pinStore.selectedPin?._id || '',
  coordinates: pinStore.selectedPin?.coordinates || {
    type: 'Point',
    coordinates: [],
  },
  owner: pinStore.selectedPin?.owner || '',
  office: pinStore.selectedPin?.office || '',
  type: pinStore.selectedPin?.type || 'Not Interested',
  address: pinStore.selectedPin?.address || '',
  city: pinStore.selectedPin?.city || '',
  state: pinStore.selectedPin?.state || '',
  zip: pinStore.selectedPin?.zip || '',
  name: pinStore.selectedPin?.name || '',
  phone: pinStore.selectedPin?.phone || '',
  email: pinStore.selectedPin?.email || '',
  notes: pinStore.selectedPin?.notes || '',
}

const newPin = ref<Pin>(defaultPin)

const typeOptions = ['Not Interested', 'Not Home', 'No Knock', 'Pitched', 'Go Back', 'Sale']

const pinMap: Record<string, string> = {
  'Not Interested': pinRed,
  Sale: pinGreen,
  Pitched: pinBlue,
  'Not Home': pinGray,
  'No Knock': pinBlack,
  'Go Back': pinYellow,
}

const confirmDelete = () => {
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
      const success = await pinStore.deletePin(newPin.value._id)

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

      setTimeout(() => {
        router.back()
      }, 2650)
    },
    reject: () => {},
  })
}

const updatePin = async () => {
  const success = await pinStore.updatePin(newPin.value)
  if (success) {
    toast.add({
      severity: 'secondary',
      summary: 'Updated!',
      detail: 'Updated Pin!',
      life: 2500,
    })

    setTimeout(() => {
      router.back()
    }, 2650)
  } else if (!success) {
    toast.add({
      severity: 'error',
      summary: 'Error!',
      detail: 'There was a problem updating the pin!',
      life: 2500,
    })
    return
  }
}
</script>

<template>
  <ConfirmDialog />
  <Toast style="max-width: 300px" />
  <div class="page-container">
    <HeaderBar title="Edit Pin" />
    <div class="scroll-container">
      <div class="horizontal">
        <h3>Created At:</h3>
        <h5>{{ new Date(newPin?.createdAt || Date.now()).toLocaleString() || `` }}</h5>
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Type</h3>
        <div class="icon-select">
          <img class="pin-icon" :src="pinMap[newPin.type]" />
          <Select
            style="flex-grow: 1"
            :options="typeOptions"
            v-model="newPin.type"
            :default-value="pinStore.selectedPin?.type"
          />
        </div>
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Address</h3>
        <InputText v-model="newPin.address" />
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>City</h3>
        <InputText v-model="newPin.city" />
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>State</h3>
        <InputText v-model="newPin.state" />
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Zip</h3>
        <InputText v-model="newPin.zip" />
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Name</h3>
        <InputText v-model="newPin.name" />
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Phone</h3>
        <InputText v-model="newPin.phone" />
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Email</h3>
        <InputText v-model="newPin.email" />
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Notes</h3>
        <InputText v-model="newPin.notes" />
      </div>
      <div class="option-container" style="margin-top: 5%; margin-bottom: 7%" v-motion-pop-visible>
        <Button @click="confirmDelete" severity="danger" icon="pi pi-trash" label="Delete" />
        <Button @click="updatePin" icon="pi pi-save" label="Save" />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.horizontal {
  display: flex;
  width: 100%;
  justify-content: space-around;
}

.icon-select {
  display: flex;
  width: 100%;
  flex-grow: 1;
}
</style>
