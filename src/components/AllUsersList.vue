<script setup lang="ts">
import { ScrollPanel } from 'primevue'
import SingleUserListItem from './SingleUserListItem.vue'

import { useUsersStore } from '../stores/usersStore'

const usersStore = useUsersStore()
</script>

<template>
  <ScrollPanel style="width: 100%; height: 100%">
    <SingleUserListItem v-for="user in usersStore.filteredUsers" :key="user._id" :user="user" />
  </ScrollPanel>
</template>
