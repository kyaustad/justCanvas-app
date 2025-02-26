<script setup lang="ts">
import { ref } from 'vue'
import { ToggleSwitch } from 'primevue'

const isEnabled = ref(false)

const emit = defineEmits<{
  (event: 'toggled-modes', value: boolean): void
}>()

const handleToggle = () => {
  emit('toggled-modes', isEnabled.value)
}
</script>

<template>
  <div class="toggle-switch" v-motion-slide-bottom>
    <p>Select Area</p>
    <ToggleSwitch @click="handleToggle" v-model="isEnabled"></ToggleSwitch>
    <p>Draw Area</p>
  </div>
</template>

<style lang="css" scoped>
.toggle-switch {
  position: absolute;
  bottom: calc(10% - 30px);
  left: calc(50% - 100px);
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #57ac7b;
  width: 200px;
  border-radius: 30px;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  box-shadow: 10px 10px 10px #242424a6;

  z-index: 1000;
}
.toggle-switch p {
  font-weight: light;
  font-family: inherit;
  font-size: small;
}
</style>
