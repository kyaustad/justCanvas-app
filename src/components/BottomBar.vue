<script setup lang="ts">
import { ref } from 'vue'
import SpeedDial from 'primevue/speeddial'
import { Button, useConfirm, useToast } from 'primevue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import Cookies from 'js-cookie'

const authStore = useAuthStore()
const router = useRouter()

const confirm = useConfirm()
const toast = useToast()

const clearAllCookies = () => {
  Object.keys(Cookies.get()).forEach((cookie) => {
    Cookies.remove(cookie)
  })
}

const confirmLogout = () => {
  confirm.require({
    message: 'Are you sure you want to logout?',
    header: 'Logout?',
    icon: 'pi pi-sign-out',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    rejectIcon: 'pi pi-times-circle',
    acceptProps: {
      label: 'Logout',
      severity: 'delete',
    },
    acceptIcon: 'pi pi-check-circle',
    accept: () => {
      toast.add({
        severity: 'secondary',
        summary: 'Confirmed',
        detail: 'You have successfully logged out!',
        life: 2500,
      })
      clearAllCookies()
      setTimeout(() => {
        authStore.logout()
        router.push('/login')
      }, 2650)
    },
    reject: () => {},
  })
}

const menuItems = ref([
  {
    label: 'Menu',
    icon: 'pi pi-bars',
    command: () => router.push('/menu'),
  },
  {
    label: 'Map',
    icon: 'pi pi-map',
    command: () => router.push('/'),
  },
  {
    label: 'Login/Logout',
    icon: authStore.isAuthenticated ? 'pi pi-sign-out' : 'pi pi-sign-in',
    command: () => {
      authStore.isAuthenticated ? confirmLogout() : router.push('/login')
    },
  },
])
</script>

<template>
  <SpeedDial
    :model="menuItems"
    direction="up"
    style="position: absolute; bottom: calc(10% - 2rem); left: calc(10% - 1rem); z-index: 1000"
    class="floating-button"
  >
    <template #button="{ toggleCallback }">
      <Button
        class="pi p-button-rounded p-button-animated shadow-button"
        @click="toggleCallback"
        style="padding: 10px"
        v-motion-slide-left
        icon="pi pi-ellipsis-h"
      >
        <!-- <i class="pi pi-ellipsis-h"></i> -->
      </Button>
    </template>
  </SpeedDial>
</template>

<style>
.floating-button {
  z-index: 900;
}
</style>
