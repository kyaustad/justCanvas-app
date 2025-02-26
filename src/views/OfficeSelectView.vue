<script setup lang="ts">
import { useAreaStore } from '../stores/areaStore'

import OfficeSelectComponent from '../components/OfficeSelectComponent.vue'
import { useAuthStore } from '../stores/authStore'
import { useOfficeStore } from '../stores/officeStore'
import { usePinStore } from '../stores/pinStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const officeStore = useOfficeStore()
const pinStore = usePinStore()
const areaStore = useAreaStore()

const setSelectedOffice = async (selectedOfficeId: string) => {
  console.log('Selected Office', selectedOfficeId)
  officeStore.setActiveOffice(selectedOfficeId)
  const fetchedPins = await pinStore.fetchUserPins(authStore.user._id)
  pinStore.setUserPins(fetchedPins)
  await areaStore.fetchUserAreas()

  router.push('/')
}
</script>

<template>
  <div class="background">
    <div
      class="login-container"
      v-motion
      :initial="{ opacity: 0, y: 100, scale: 0.75 }"
      :enter="{ opacity: 1, y: 0, scale: 1 }"
      :variants="{ custom: { scale: 2 } }"
      :delay="150"
      :duration="500"
    >
      <div class="login-items">
        <img
          src="/banner_colored_transparent.png"
          style="width: 200px"
          v-motion
          :initial="{ opacity: 0, y: 100 }"
          :enter="{ opacity: 1, y: 0, scale: 1 }"
          :variants="{ custom: { scale: 2 } }"
          :delay="200"
          :hovered="{ scale: 1.1 }"
          :duration="1000"
        />
        <p style="color: black; text-align: center">Select Your Active Team</p>
        <OfficeSelectComponent
          :offices="authStore.user.offices"
          button-severity="secondary"
          @formSubmitted="setSelectedOffice"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.background {
  background-color: #468c78;
  align-items: center;
  justify-content: center;
  display: grid;
  height: calc(100vh);
}
.login-container {
  background-color: #34d399;
  border-radius: 20px;
  box-shadow: 15px 15px 10px #44444489;
  height: 70%;
  margin-bottom: 20px;
}
.login-items {
  padding: 30px;

  display: grid;
  align-items: center;
  justify-content: center;
}
</style>
