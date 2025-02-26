<script setup lang="ts">
import HeaderBar from '../components/HeaderBar.vue'
import BottomBar from '../components/BottomBar.vue'
import AddButton from '../components/AddButton.vue'
import AllUsersList from '../components/AllUsersList.vue'
import { ConfirmDialog, InputText, InputIcon, IconField, Toast } from 'primevue'
import { onMounted, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { User } from '../types/user'

import { useUsersStore } from '../stores/usersStore'

const usersStore = useUsersStore()

const userFilter = ref('')

const debounceSearch = useDebounceFn(() => {
  console.log('Search Changed')
  if (!userFilter.value.trim()) {
    usersStore.filteredUsers = [...usersStore.allUsers].sort((a: User, b: User) => {
      return a.lastName.localeCompare(b.lastName)
    })
  } else {
    usersStore.filteredUsers = usersStore.allUsers
      .filter(
        (user) =>
          user.username?.toLowerCase().includes(userFilter.value.toLowerCase()) ||
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(userFilter.value.toLowerCase())
      )
      .sort((a, b) => {
        return a.lastName.localeCompare(b.lastName)
      })
  }
}, 500)

onMounted(async () => {
  await usersStore.fetchAllUsersBasedOnRole()

  usersStore.filteredUsers = [...usersStore.allUsers].sort((a, b) => {
    return a.lastName.localeCompare(b.lastName)
  })
})
</script>

<template>
  <ConfirmDialog />
  <Toast style="max-width: 300px" />
  <div class="page-container">
    <HeaderBar title="Users" />
    <AddButton mode="users" />
    <div class="search-bar">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText @value-change="debounceSearch" v-model="userFilter" label="search" />
      </IconField>
    </div>
    <div class="scroll-container">
      <AllUsersList />
    </div>
  </div>
  <BottomBar />
</template>
