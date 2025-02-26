<script setup lang="ts">
import HeaderBar from '../components/HeaderBar.vue'
import BottomBar from '../components/BottomBar.vue'
import AddButton from '../components/AddButton.vue'
import { ConfirmDialog, InputText, InputIcon, IconField, Toast } from 'primevue'
import { onMounted, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import AllOfficesList from '../components/AllOfficesList.vue'
import type { Office } from '../types/office'

import { useOfficeStore } from '../stores/officeStore'

const officeStore = useOfficeStore()

const officeFilter = ref('')

const debounceSearch = useDebounceFn(() => {
  console.log('Search Changed')
  if (!officeFilter.value.trim()) {
    officeStore.filteredOffices = [...officeStore.allOffices]
  } else {
    officeStore.filteredOffices = officeStore.allOffices.filter(
      (office: Office) =>
        office.name?.toLowerCase().includes(officeFilter.value.toLowerCase()) ||
        office.city.toLowerCase().includes(officeFilter.value.toLowerCase()) ||
        office.state.toLowerCase().includes(officeFilter.value.toLowerCase())
    )
  }
}, 500)

onMounted(async () => {
  await officeStore.getAllOffices()

  officeStore.filteredOffices = [...officeStore.allOffices]
})
</script>

<template>
  <ConfirmDialog />
  <Toast style="max-width: 300px" />
  <div class="page-container">
    <HeaderBar title="Teams" />
    <AddButton mode="teams" />
    <div class="search-bar">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText @value-change="debounceSearch" v-model="officeFilter" label="search" />
      </IconField>
    </div>
    <div class="scroll-container">
      <AllOfficesList :offices="officeStore.filteredOffices" />
    </div>
  </div>
  <BottomBar />
</template>
