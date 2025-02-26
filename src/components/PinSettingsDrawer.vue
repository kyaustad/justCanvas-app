<script setup lang="ts">
import { Drawer, InputNumber } from 'primevue'
import { ref } from 'vue'
import { useSettingsStore } from '../stores/settingsStore'

const settingsStore = useSettingsStore()
const settingChanged = ref(false)

const isVisible = ref(false)
const ageFilter = ref<number>(parseInt(settingsStore.pinAgeFilter || '2'))

const toggleDrawerVisible = () => {
  isVisible.value = !isVisible.value
}

defineExpose({
  toggleDrawerVisible,
})

const checkSettingsChanged = () => {
  if (settingChanged.value) {
    settingsStore.pinAgeFilter = ageFilter.value.toString()
    settingChanged.value = false
    console.log(settingsStore.pinAgeFilter)
    emit('settings-changed')
    return
  }
  settingChanged.value = false
}

const handleValueChanged = () => {
  settingChanged.value = true
}

const emit = defineEmits<{
  (event: 'settings-changed'): void
}>()
</script>

<template>
  <Drawer
    @hide="checkSettingsChanged"
    v-model:visible="isVisible"
    header="Pin Settings"
    position="bottom"
    style="height: auto"
  >
    <div style="padding: 10px">
      <h3>Show Pins</h3>
      <div style="display: flex; padding: 5px; justify-content: left; align-items: center">
        <InputNumber
          @update:model-value="handleValueChanged"
          size="large"
          v-model="ageFilter"
          input-id="integeronly"
          :min="1"
          :max="40"
        ></InputNumber>
        <p style="margin-left: 3%">Days Old</p>
      </div>
    </div>
  </Drawer>
</template>

<style lang="css" scoped>
Drawer {
  z-index: 1300;
}
</style>
