<script setup lang="ts">
import { Button, useConfirm, useToast } from 'primevue'
import { useUsersStore } from '../stores/usersStore'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

import type { User } from '../types/user'

const confirm = useConfirm()
const toast = useToast()
const userStore = useUsersStore()
const authStore = useAuthStore()
const router = useRouter()

const props = defineProps<{
  user: User
}>()

const confirmDeleteUser = () => {
  confirm.require({
    message: 'Are you sure you want to delete this user?',
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
      const success = await userStore.deleteUser(props.user._id)

      if (!success) {
        toast.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'There was a problem deleting the user!',
          life: 2500,
        })
        return
      }
      if (success) {
        toast.add({
          severity: 'secondary',
          summary: 'Deleted!',
          detail: 'Deleted User!',
          life: 2500,
        })
      }
    },

    reject: () => {},
  })
}

const handleViewUserClicked = async () => {
  userStore.activeViewedUser = await userStore.fetchUserFromId(props.user._id || '')
  router.push(`/users/${props.user._id}`)
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
          <i class="pi pi-user" style="color: lightgray; font-size: 1.5rem" />
          <div class="text-container">
            <h3>{{ user.firstName }} {{ user.lastName }}</h3>
            <p>{{ user.username }}</p>
          </div>
        </div>
        <div class="button-container">
          <Button
            v-if="props.user._id !== authStore.user._id"
            severity="danger"
            icon="pi pi-trash"
            @click="confirmDeleteUser"
          />

          <Button @click="handleViewUserClicked" severity="info" icon="pi pi-user-edit" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
