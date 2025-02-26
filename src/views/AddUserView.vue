<script setup lang="ts">
import HeaderBar from '../components/HeaderBar.vue'
import BottomBar from '../components/BottomBar.vue'
import AddUserForm from '../components/AddUserForm.vue'
import { ref, onMounted } from 'vue'
import { ConfirmDialog, Toast } from 'primevue'

import { useAuthStore } from '../stores/authStore'
import { useOfficeStore } from '../stores/officeStore'
import { useUsersStore } from '../stores/usersStore'
import type { Office } from '../types/office'

const authStore = useAuthStore()
const officeStore = useOfficeStore()
const usersStore = useUsersStore()

const availableRoles = ref([{ name: 'User', value: 0 }])
const availableOffices = ref<Office[]>(authStore.user.offices)

onMounted(async () => {
  if (authStore.user.role === 2) {
    availableRoles.value.push({ name: 'Team Manager', value: 1 }, { name: 'Admin', value: 2 })
  }
  if (authStore.user.role === 3) {
    availableRoles.value.push(
      { name: 'Team Manager', value: 1 },
      { name: 'Admin', value: 2 },
      { name: 'System Admin', value: 3 }
    )
  }
  if (authStore.user.role >= 2) {
    await officeStore.getAllOffices()
    availableOffices.value = [...officeStore.allOffices]
  }
})
</script>

<template>
  <ConfirmDialog />
  <Toast style="max-width: 300px" />
  <div class="page-container">
    <HeaderBar title="Add User" />

    <div class="scroll-container">
      <AddUserForm
        :possible-offices="availableOffices"
        :possible-roles="availableRoles"
        :possible-supervisors="usersStore.allUsers"
      ></AddUserForm>
    </div>
  </div>
</template>
