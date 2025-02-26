<script setup lang="ts">
import { ScrollPanel } from 'primevue'
import SingleOfficeListItem from './SingleOfficeListItem.vue'
import type { Office } from '../types/office'

const props = defineProps<{
  offices: Office[]
}>()
</script>

<template>
  <ScrollPanel style="width: 100%; height: 100%">
    <SingleOfficeListItem v-for="office in props.offices" :key="office._id" :office="office" />
  </ScrollPanel>
</template>
