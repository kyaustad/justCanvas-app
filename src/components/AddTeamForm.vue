<script setup lang="ts">
import { Form, type FormResolverOptions, type FormSubmitEvent } from '@primevue/forms'
import { InputText, Message, Button, Toast, ConfirmDialog } from 'primevue'
import { reactive } from 'vue'

import { useOfficeStore } from '../stores/officeStore'
import type { Office } from '../types/office'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const officeStore = useOfficeStore()
const router = useRouter()

interface FormValues {
  name: string
  city: string
  state: string
}

interface FormErrors {
  name?: { message: string }[]
  city?: { message: string }[]
  state?: { message: string }[]
}

const initialValues = reactive<Office>({
  name: '',
  city: '',
  state: '',
})

const resolver = ({ values }: FormResolverOptions) => {
  const errors: FormErrors = {}

  // Name Validation
  if (!values.name) {
    errors.name = [{ message: 'Name is required' }]
  } else if (values.name.length < 5) {
    errors.name = [{ message: 'Name must be at least 5 characters long!' }]
  } else if (values.name.length > 25) {
    errors.name = [{ message: 'Name must be less than 25 characters long!' }]
  } else if (officeStore.allOffices.some((office) => office.name === values.name)) {
    errors.name = [{ message: 'Another Team Exists With That Name!' }]
  }

  // City Validation
  if (!values.city) {
    errors.city = [{ message: 'City is required' }]
  } else if (values.city.length < 3) {
    errors.city = [{ message: 'City must be at least 3 characters long!' }]
  } else if (values.city.length > 25) {
    errors.city = [{ message: 'City must be less than 25 characters long!' }]
  }

  // State Validation
  if (!values.state) {
    errors.state = [{ message: 'State is required' }]
  } else if (values.state.length < 2) {
    errors.state = [{ message: 'State must be at least 2 characters long!' }]
  } else if (values.state.length > 25) {
    errors.state = [{ message: 'State must be less than 25 characters long!' }]
  }

  return {
    values,
    errors,
  }
}

const onFormSubmit = async (form: FormSubmitEvent) => {
  if (form.valid) {
    console.log('Form VALID!', form.values)

    await officeStore.saveNewOffice(form.values as Office)
    toast.add({
      severity: 'contrast',
      summary: 'Added New Team',
      detail: 'New Team Created and Saved!',
      life: 2200,
    })

    setTimeout(() => {
      router.push('/teams')
    }, 3000)
  }
}
</script>

<template>
  <ConfirmDialog />
  <Toast style="max-width: 300px" />
  <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
    <div class="form-group">
      <h3>Team Name</h3>
      <InputText name="name" type="text" placeholder="Team Name" fluid />
      <Message v-if="$form.name?.invalid" severity="error" variant="simple">{{
        $form.name?.error?.message
      }}</Message>
    </div>

    <div class="form-group">
      <h3>City</h3>
      <InputText name="city" type="text" placeholder="City" fluid />
      <Message v-if="$form.city?.invalid" severity="error" variant="simple">{{
        $form.city?.error?.message
      }}</Message>
    </div>

    <div class="form-group">
      <h3>State</h3>
      <InputText name="state" type="text" placeholder="State" fluid />
      <Message v-if="$form.state?.invalid" severity="error" variant="simple">{{
        $form.state?.error?.message
      }}</Message>
    </div>
    <div class="form-buttons">
      <Button type="submit" severity="info" label="Create" icon="pi pi-plus" />
    </div>
  </Form>
</template>
