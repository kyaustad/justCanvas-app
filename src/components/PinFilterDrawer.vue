<script setup lang="ts">
import { Drawer, InputNumber, Select, InputText } from 'primevue'
import { ref } from 'vue'

interface filterSettings {
  age?: number
  type?: string
  zip?: number
  state?: string
  city?: string
}

const typeOptions = ['Not Interested', 'Not Home', 'No Knock', 'Pitched', 'Go Back', 'Sale']

const isVisible = ref(false)
const filterSettings = ref<filterSettings>({})
const anySettingChanged = ref(false)

const toggleDrawerVisible = () => {
  isVisible.value = !isVisible.value
}

const emit = defineEmits<{
  (event: 'filters-changed', newFilters: filterSettings): void
}>()

defineExpose({
  toggleDrawerVisible,
})

const handleHide = () => {
  if (anySettingChanged.value) {
    emit('filters-changed', filterSettings.value)
    anySettingChanged.value = false
  }
}

const handleZipChange = () => {
  console.log('ZIP CHANGED')
  anySettingChanged.value = true
}
const handleCityChange = () => {
  console.log('CITY CHANGED')
  anySettingChanged.value = true
}
const handleStateChange = () => {
  console.log('STATE CHANGED')
  anySettingChanged.value = true
}
const handleAgeChange = () => {
  console.log('AGE CHANGED')
  anySettingChanged.value = true
}
const handleTypeChange = () => {
  console.log('TYPE CHANGED')
  anySettingChanged.value = true
}
</script>

<template>
  <Drawer @hide="handleHide" position="right" v-model:visible="isVisible">
    <div style="padding: 5px; display: flex; flex-direction: column" v-motion-roll-right>
      <p>Only Show Pins This Many Days Old</p>
      <InputNumber
        @value-change="handleAgeChange"
        placeholder="Days Old (1-40)"
        v-model="filterSettings.age"
        size="large"
        input-id="integeronly"
        :min="1"
        :max="40"
      />
    </div>

    <div style="padding: 5px; display: flex; flex-direction: column" v-motion-roll-right>
      <p>Type</p>
      <Select
        v-model="filterSettings.type"
        @value-change="handleTypeChange"
        :options="typeOptions"
      />
    </div>

    <div style="padding: 5px; display: flex; flex-direction: column" v-motion-roll-right>
      <p>City</p>
      <InputText
        @value-change="handleCityChange"
        placeholder="City"
        v-model="filterSettings.city"
        size="large"
        type="text"
        fluid
      />
    </div>

    <div style="padding: 5px; display: flex; flex-direction: column" v-motion-roll-right>
      <p>State</p>
      <InputText
        @value-change="handleStateChange"
        placeholder="State"
        v-model="filterSettings.state"
        size="large"
        type="text"
        fluid
      />
    </div>

    <div style="padding: 5px; display: flex; flex-direction: column" v-motion-roll-right>
      <p>Zip</p>
      <InputNumber
        @value-change="handleZipChange"
        placeholder="Zip Code"
        v-model="filterSettings.zip"
        size="large"
        input-id="integeronly"
        :useGrouping="false"
      />
    </div>
  </Drawer>
</template>
