<script setup lang="ts">
import { Select, Button } from 'primevue'
import type { Office } from '../types/office'
import { ref } from 'vue'

const props = defineProps<{
  offices: Office[]
  buttonSeverity: string
}>()

const formSubmitted = (selectedOfficeId: string) => {
  emit('formSubmitted', selectedOfficeId)
}

const emit = defineEmits<{
  (event: 'formSubmitted', officeId: string): void
}>()

const selectedOffice = ref<string | undefined>(props.offices[0]._id || '')
</script>

<template>
  <form @submit.prevent="formSubmitted(selectedOffice as string)">
    <Select
      placeholder="Select Your Active Team"
      v-model="selectedOffice"
      optionLabel="name"
      :options="props.offices"
      optionValue="_id"
      :defaultValue="props.offices[0]._id"
      style="display: flex"
    ></Select>
    <Button
      style="margin-left: 70px; margin-top: 40px"
      type="submit"
      :severity="props.buttonSeverity || 'secondary'"
      label="Save"
    ></Button>
  </form>
</template>
