<script setup lang="ts">
import { Button, useConfirm, useToast } from 'primevue'
import { useOfficeStore } from '../stores/officeStore'
import { useRouter } from 'vue-router'

import type { Office } from '../types/office'

const toast = useToast()
const router = useRouter()
const confirm = useConfirm()
const officeStore = useOfficeStore()

const props = defineProps<{
  office: Office
}>()

const confirmDeleteOffice = () => {
  confirm.require({
    message: 'Are you sure you want to delete this team?',
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
      const success = await officeStore.deleteOffice(props.office._id)

      if (!success) {
        toast.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'There was a problem deleting the team!',
          life: 2500,
        })
        return
      }

      toast.add({
        severity: 'secondary',
        summary: 'Deleted!',
        detail: 'Deleted Team!',
        life: 2500,
      })
    },
    reject: () => {},
  })
}

const editOffice = () => {
  router.push(`/teams/${props.office._id}`)
}
</script>

<template>
  <div class="pin-entry">
    <div class="entry-background">
      <div class="info-container" v-motion-pop-visible>
        <div
          class="entry-container"
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 210px;
          "
        >
          <i class="pi pi-building" style="color: lightgray; font-size: 1.5rem" />
          <div class="text-container">
            <h3>{{ office.name }}</h3>
            <p>City: {{ office.city }}</p>
          </div>
        </div>
        <div class="button-container">
          <Button severity="danger" @click="confirmDeleteOffice" icon="pi pi-trash" />
          <Button severity="info" @click="editOffice" icon="pi pi-user-edit" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
