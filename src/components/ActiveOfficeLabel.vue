<script setup lang="ts">
import { useOfficeStore } from '../stores/officeStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const officeStore = useOfficeStore()
const authStore = useAuthStore()

const activeOffice = ref<string | undefined>(officeStore.activeOffice?.name)

const handleClick = () => {
  if (authStore.user.offices.length > 1) {
    router.push('/office-select')
    return
  } else {
    return
  }
}
</script>

<template>
  <div
    class="office-label"
    style="position: absolute; top: calc(5% - 0.5rem); left: calc(50% - 2.5rem); cursor: pointer"
    v-motion-slide-top
    @click="handleClick"
  >
    <p class="office-label-text">{{ activeOffice }}</p>
  </div>
</template>

<style lang="css" scoped>
.office-label {
  z-index: 850;
  background-color: #1f1f1fb9;
  box-shadow: 5px 5px 5px #0000003a;
  border-radius: 20px;
  height: auto;
  width: auto;
  text-align: center;
  text-wrap: nowrap;
}
.office-label-text {
  color: white;
  font-size: small;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
