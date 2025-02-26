<script setup lang="ts">
import BottomBar from '../components/BottomBar.vue'
import { Button, ConfirmDialog, Toast } from 'primevue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const pinHistoryClicked = () => {
  router.push(`/pin-history/${authStore.user._id}`)
}

const usersClicked = () => {
  router.push('/users')
}

const teamsClicked = () => {
  router.push('/teams')
}
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <Toast style="max-width: 300px" />
  <div class="background">
    <div v-motion-fade-visible-once class="menu-container">
      <div class="menu-items">
        <img src="/banner_colored_transparent.png" style="width: 180px" />
        <Button
          @click="pinHistoryClicked"
          icon="pi pi-history"
          severity="info"
          label="My Pin History"
        ></Button>
        <Button
          v-if="authStore.user.role >= 1"
          @click="usersClicked"
          icon="pi pi-users"
          severity="help"
          label="Users"
        ></Button>
        <Button
          v-if="authStore.user.role >= 2"
          @click="teamsClicked"
          icon="pi pi-building"
          severity="warn"
          label="Teams"
        ></Button>
      </div>
    </div>
    <BottomBar />
  </div>
</template>

<style scoped>
.background {
  background-color: #468c78;
  align-items: center;
  justify-content: center;
  display: grid;
  height: calc(100vh);
}

Button {
  box-shadow: 5px 10px 5px #00000080;
}
/* box-shadow: 15px 15px 10px #44444489; */
.menu-container {
  background-color: #34d399;
  border-radius: 20px;

  height: 70%;
  margin-bottom: 20px;
  box-shadow: 15px 15px 10px #44444489;
}
.menu-items {
  padding: 40px;
  gap: 30%;
  display: grid;
  align-items: center;
  justify-content: center;
}
</style>
