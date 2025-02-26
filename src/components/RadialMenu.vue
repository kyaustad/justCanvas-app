<script setup lang="ts">
import { SpeedDial, Button } from 'primevue'
import { ref } from 'vue'
import { pinBlue, pinGreen, pinGray, pinBlack, pinYellow, pinRed } from '../assets/icons'

const menuItems = ref([
  {
    label: 'Not Interested',
    icon: pinRed,
    style:
      '--p-button-primary-background: #a0231f80; --p-button-primary-border-color: #a0231f80; --p-button-primary-hover-background: #ca403cce; --p-button-primary-hover-border-color: #ca403cce;',
    command: () => {
      clickedPin('Not Interested')
    },
  },
  {
    label: 'Pitched',
    icon: pinBlue,
    style:
      '--p-button-primary-background: #2a758b7c; --p-button-primary-border-color: #2a758b7c; --p-button-primary-hover-background: #29819cc4; --p-button-primary-hover-border-color: #29819cc4;',
    command: () => {
      clickedPin('Pitched')
    },
  },
  {
    label: 'Sale',
    icon: pinGreen,
    style:
      '--p-button-primary-background: #4c923e9d; --p-button-primary-border-color: #4c923e9d; --p-button-primary-hover-background: #67be56d2; --p-button-primary-hover-border-color: #67be56d2;',
    command: () => {
      clickedPin('Sale')
    },
  },
  {
    label: 'Go Back',
    icon: pinYellow,
    style:
      '--p-button-primary-background: #95971591; --p-button-primary-border-color: #95971591; --p-button-primary-hover-background: #c7c948da; --p-button-primary-hover-border-color: #c7c948da;',
    command: () => {
      clickedPin('Go Back')
    },
  },
  {
    label: 'Not Home',
    icon: pinGray,
    style:
      '--p-button-primary-background: #00000096; --p-button-primary-border-color: #00000096; --p-button-primary-hover-background: #242424e3; --p-button-primary-hover-border-color: #242424e3;',
    command: () => {
      clickedPin('Not Home')
    },
  },
  {
    label: 'No Knock',
    icon: pinBlack,
    style:
      '--p-button-primary-background: #58585886; --p-button-primary-border-color: #58585886; --p-button-primary-hover-background: #464646c2; --p-button-primary-hover-border-color: #464646c2;',
    command: () => {
      clickedPin('No Knock')
    },
  },
])

const clickedClose = () => {
  emit('clickedClose')
}

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
})

const menuHidden = () => {
  emit('menuHidden')
}

const clickedPin = (pinType: string) => {
  emit('clicked-pin', pinType)
}

const emit = defineEmits<{
  (event: 'clickedClose'): void
  (event: 'menuHidden'): void
  (event: 'clicked-pin', pinType: string): void
}>()
</script>

<template>
  <SpeedDial
    :visible="props.visibility"
    :model="menuItems"
    type="circle"
    :radius="70"
    :hideOnClickOutside="false"
    class="floating-button"
    :transitionDelay="0"
    style="position: absolute; left: calc(50%); top: calc(50%)"
    @click="clickedClose"
    @hide="menuHidden"
  >
    <template #item="{ item, toggleCallback }">
      <div>
        <Button
          raised
          severity="primary"
          @click="toggleCallback"
          class="radial-button pi p-button-rounded p-button-animated"
          :style="item.style"
        >
          <img :src="item.icon" style="width: 14px" />
        </Button>
      </div>
    </template>
  </SpeedDial>
</template>

<style lang="css" scoped>
.radial-button {
  width: 48px;
}

button {
  --p-button-primary-background: #242424e3;
  --p-button-primary-border-color: yellow;
  --p-button-primary-hover-background: purple;
  --p-button-primary-hover-border-color: blue;
}
</style>
