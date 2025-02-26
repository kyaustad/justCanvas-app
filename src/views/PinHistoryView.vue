<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useRoute } from 'vue-router'
import { usePinStore } from '../stores/pinStore'
import { useUsersStore } from '../stores/usersStore'
import { useSettingsStore } from '../stores/settingsStore'
import { ConfirmDialog, Button, Toast, InputIcon, IconField, InputText } from 'primevue'
import { useDebounceFn } from '@vueuse/core'
import BottomBar from '../components/BottomBar.vue'
import HeaderBar from '../components/HeaderBar.vue'
import PinHistoryList from '../components/PinHistoryList.vue'
import PinFilterDrawer from '../components/PinFilterDrawer.vue'

import type { Pin } from '../types/pin'

interface PinSettingsDrawerMethods {
  toggleDrawerVisible: () => void
}

interface filterSettings {
  age?: number
  type?: string
  zip?: number
  state?: string
  city?: string
}

const usersStore = useUsersStore()
const settingsStore = useSettingsStore()
const route = useRoute()
const pinStore = usePinStore()

const userId = ref()
const pinFilterDrawerRef = ref<ComponentPublicInstance<PinSettingsDrawerMethods> | null>(null)

const filteredPins = ref<Pin[]>([])
const userPins = ref<Pin[]>([])
const pinSearch = ref('')

const fetchPinsFromId = async (id: string) => {
  return await pinStore.fetchUserPins(id)
}

const debounceSearch = useDebounceFn(async () => {
  console.log('Search Changed')
  if (!pinSearch.value.trim()) {
    filteredPins.value = [...userPins.value]
    console.log('No Search Found')
  } else {
    filteredPins.value = [
      ...userPins.value.filter((pin) =>
        pin.name?.toLowerCase().includes(pinSearch.value.toLowerCase())
      ),
    ]
    console.log('Filtered Pins:', filteredPins.value)
  }
}, 500)

const togglePinFilterDrawer = () => {
  if (pinFilterDrawerRef.value) {
    pinFilterDrawerRef.value.toggleDrawerVisible()
  }
}

const handleFiltersChanged = async (event: filterSettings) => {
  filteredPins.value = [...userPins.value]
  if (event.age) {
    settingsStore.pinAgeFilter = event.age.toString()
    userPins.value = await fetchPinsFromId(userId.value)
    filteredPins.value = [...userPins.value]
  }
  if (event.type) {
    filteredPins.value = [...userPins.value.filter((pin) => pin.type === event.type)]
  }
  if (event.city) {
    filteredPins.value = [
      ...filteredPins.value.filter((pin) => pin.city?.toLowerCase() === event.city?.toLowerCase()),
    ]
  }
  if (event.state) {
    filteredPins.value = [
      ...filteredPins.value.filter(
        (pin) => pin.state?.toLowerCase() === event.state?.toLowerCase()
      ),
    ]
  }
  if (event.zip) {
    filteredPins.value = [
      ...filteredPins.value.filter((pin) => pin.zip?.toString() === event.zip?.toString()),
    ]
  }
}

const refreshPins = async () => {
  userPins.value = await await pinStore.fetchUserPins(userId.value)
  filteredPins.value = [...userPins.value]
}

onMounted(async () => {
  userId.value = route.params.id
  console.log(userId.value)
  userPins.value = await fetchPinsFromId(userId.value)
  filteredPins.value = [...userPins.value]
  usersStore.activeViewedUser = await usersStore.fetchUserFromId(userId.value)
})
</script>

<template>
  <ConfirmDialog />
  <Toast style="max-width: 300px" />
  <div class="page-container">
    <HeaderBar :title="`${usersStore.activeViewedUser.firstName || ''}'s Pin History`" />
    <div class="search-bar">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          @value-change="debounceSearch"
          v-model="pinSearch"
          label="search"
          placeholder="Search for a Name"
        />
      </IconField>
    </div>
    <div class="scroll-container">
      <PinHistoryList @pin-deleted="refreshPins" :user-pins="filteredPins" />
    </div>
  </div>
  <PinFilterDrawer @filters-changed="handleFiltersChanged" ref="pinFilterDrawerRef" />
  <Button
    @click="togglePinFilterDrawer"
    icon="pi pi-filter"
    class="pi p-button-rounded p-button-animated shadow-button filter-button"
    severity="help"
    size="large"
  />
  <BottomBar />
</template>

<style lang="css" scoped>
.filter-button {
  position: absolute;
  bottom: calc(10% - 2rem);
  right: calc(10% - 1rem);
  z-index: 1000;
  min-width: 44px;
  min-height: 44px;
}
</style>
