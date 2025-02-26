<script setup lang="ts">
import { Form, type FormResolverOptions, type FormSubmitEvent } from '@primevue/forms'
import { InputText, Message, Button, Toast, ConfirmDialog } from 'primevue'
import { ref } from 'vue'

import { useOfficeStore } from '../stores/officeStore'
import type { Office } from '../types/office'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const officeStore = useOfficeStore()
const router = useRouter()

const props = defineProps<{
  office: Office | undefined
}>()

const newOffice = ref()

interface FormErrors {
  name?: { message: string }[]
  city?: { message: string }[]
  state?: { message: string }[]
}

let changed = {
  name: false,
  city: false,
  state: false,
}

const resolver = ({ values }: FormResolverOptions) => {
  const errors: FormErrors = {}

  // Name Validation
  if (changed.name) {
    if (!values.name) {
      errors.name = [{ message: 'Name is required' }]
    } else if (values.name.length < 5) {
      errors.name = [{ message: 'Name must be at least 5 characters long!' }]
    } else if (values.name.length > 25) {
      errors.name = [{ message: 'Name must be less than 25 characters long!' }]
    } else if (officeStore.allOffices.some((office) => office.name === values.name)) {
      errors.name = [{ message: 'Another Team Exists With That Name!' }]
    }
  }

  // City Validation
  if (changed.city) {
    if (!values.city) {
      errors.city = [{ message: 'City is required' }]
    } else if (values.city.length < 3) {
      errors.city = [{ message: 'City must be at least 3 characters long!' }]
    } else if (values.city.length > 25) {
      errors.city = [{ message: 'City must be less than 25 characters long!' }]
    }
  }

  // State Validation
  if (changed.state) {
    if (!values.state) {
      errors.state = [{ message: 'State is required' }]
    } else if (values.state.length < 2) {
      errors.state = [{ message: 'State must be at least 2 characters long!' }]
    } else if (values.state.length > 25) {
      errors.state = [{ message: 'State must be less than 25 characters long!' }]
    }
  }

  return {
    values,
    errors,
  }
}

const onFormSubmit = async (form: FormSubmitEvent) => {
  if (form.valid) {
    console.log('Form VALID!', form.values)
    newOffice.value = form.values as Office
    newOffice.value._id = props.office?._id
    const success = await officeStore.updateOffice(newOffice.value as Office)
    if (success) {
      toast.add({
        severity: 'contrast',
        summary: 'Updated Team!',
        detail: 'Team Updated and Saved!',
        life: 2200,
      })
      changed.city = false
      changed.name = false
      changed.state = false
      setTimeout(() => {
        router.push('/teams')
      }, 3000)
    } else if (!success) {
      toast.add({
        severity: 'error',
        summary: 'Error Updated Team!',
        detail: 'There was an issue updating the team!',
        life: 2200,
      })
    }
  }
}

const handleNameChange = () => {
  changed.name = true
  console.log('changed name')
}
const handleCityChanged = () => {
  changed.city = true
  console.log('changed City')
}
const handleStateChanged = () => {
  changed.state = true
  console.log('changed State')
}
</script>

<template>
  <ConfirmDialog />
  <Toast style="max-width: 300px" />
  <Form v-slot="$form" :initialValues="props.office" :resolver @submit="onFormSubmit">
    <div class="form-group">
      <h3>Team Name</h3>
      <InputText
        @value-change="handleNameChange"
        name="name"
        type="text"
        placeholder="Team Name"
        fluid
      />
      <Message v-if="$form.name?.invalid" severity="error" variant="simple">{{
        $form.name?.error?.message
      }}</Message>
    </div>

    <div class="form-group">
      <h3>City</h3>
      <InputText
        @value-change="handleCityChanged"
        name="city"
        type="text"
        placeholder="City"
        fluid
      />
      <Message v-if="$form.city?.invalid" severity="error" variant="simple">{{
        $form.city?.error?.message
      }}</Message>
    </div>

    <div class="form-group">
      <h3>State</h3>
      <InputText
        @value-change="handleStateChanged"
        name="state"
        type="text"
        placeholder="State"
        fluid
      />
      <Message v-if="$form.state?.invalid" severity="error" variant="simple">{{
        $form.state?.error?.message
      }}</Message>
    </div>
    <div class="form-buttons">
      <Button type="submit" severity="info" label="Save" icon="pi pi-save" />
    </div>
  </Form>
</template>
