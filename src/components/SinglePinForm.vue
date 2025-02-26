<script setup lang="ts">
import { Button, InputText } from 'primevue'

import type { Pin } from '../types/pin'

const props = defineProps<{
  pin: Pin | undefined
}>()
</script>

<template>
  <div class="input-group"></div>
</template>
