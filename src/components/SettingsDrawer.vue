<script setup lang="ts">
import { Drawer, Slider, ColorPicker } from 'primevue'
import { ref, computed } from 'vue'
import { useSettingsStore } from '../stores/settingsStore'
import Color from 'color'

const settingsStore = useSettingsStore()

const isVisible = ref(false)
const sliderChanged = ref(false)

const convertedColorRGB = computed(() => {
  return Color(`#${colorValue.value}`).rgb().string()
})

const convertedAlphaRGB = computed(() => {
  const values = convertedColorRGB.value.match(/\d+/g)
  if (values) {
    return `rgba(${values[0]}, ${values[1]}, ${values[2]}, 0.15)`
  }
})

const colorValue = ref(settingsStore.areaLineColor)
const toggleDrawerVisible = () => {
  isVisible.value = !isVisible.value
}

const handleSliderChange = () => {
  sliderChanged.value = true
}

const handleColorChange = () => {
  sliderChanged.value = true
}

defineExpose({
  toggleDrawerVisible,
  isVisible,
})

const checkOpacityChanged = () => {
  if (sliderChanged.value) {
    emit('settings-changed')
    console.log('Value WAS CHANGED')
    settingsStore.areaLineColor = `${colorValue.value}`

    settingsStore.areaFillColor = convertedAlphaRGB.value
    sliderChanged.value = false
    return
  }
  sliderChanged.value = false
  console.log('NO CHANGE')
}

const emit = defineEmits<{
  (event: 'settings-changed'): void
}>()
</script>

<template>
  <Drawer
    v-model:visible="isVisible"
    header="Map Settings"
    position="bottom"
    style="height: auto"
    @hide="checkOpacityChanged"
  >
    <div style="padding: 10px">
      <h3>Map Opacity</h3>
      <Slider
        :min="0"
        :max="1"
        :step="0.01"
        @change="handleSliderChange"
        v-model="settingsStore.mapOpacity"
      ></Slider>
    </div>
    <div style="padding: 10px">
      <h3>Area Color</h3>
      <div style="display: flex; justify-content: center">
        <ColorPicker
          @change="handleColorChange"
          v-model="colorValue"
          format="hex"
          inline
        ></ColorPicker>
        <div :style="{ backgroundColor: convertedColorRGB }" class="color-preview"></div>
      </div>
    </div>
  </Drawer>
</template>

<style lang="css" scoped>
.color-preview {
  margin: 10px;
  border-radius: 10px;
  width: 40px;
  height: 40px;
}
</style>
