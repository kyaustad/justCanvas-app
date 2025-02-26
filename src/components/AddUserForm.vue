<script setup lang="ts">
import { Form, type FormResolverOptions, type FormSubmitEvent } from '@primevue/forms'
import {
  InputText,
  Message,
  Button,
  Toast,
  ConfirmDialog,
  ScrollPanel,
  Select,
  MultiSelect,
} from 'primevue'
import { reactive, ref } from 'vue'
import { useAxios } from '@vueuse/integrations/useAxios'

import { useUsersStore } from '../stores/usersStore'
import { useAuthStore } from '../stores/authStore'
import type { User } from '../types/user'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import type { Office } from '../types/office'

const toast = useToast()

const usersStore = useUsersStore()
const authStore = useAuthStore()
const router = useRouter()

interface Role {
  name: string
  value: number
}

const props = defineProps<{
  possibleOffices: Office[]
  possibleRoles: Role[]
  possibleSupervisors: User[]
}>()

interface FormValues {
  username: string
  city: string
  state: string
}

interface FormErrors {
  username?: { message: string }[]
  password?: { message: string }[]
  firstName?: { message: string }[]
  lastName?: { message: string }[]
  role?: { message: string }[]
  offices?: { message: string }[]
  supervisor?: { message: string }[]
}

const initialValues = reactive<User>({
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 0,
  offices: [],
})

const selectedRole = ref(0)
const usernameAvailable = ref(true)

const isUsernameAvailable = async (username: string) => {
  const { data, error } = await useAxios(
    `https://${authStore.company}.justcanvas.app/api/v1/users/check-username/${username}`,
    {
      method: 'GET',
      withCredentials: true,
    }
  )

  if (error.value) {
    console.log('error checking username', error.value)
    throw error.value
  }

  return data.value.available
}

const getFullName = (option: User) => {
  return `${option.firstName} ${option.lastName}`
}

const resolver = ({ values }: FormResolverOptions) => {
  const errors: FormErrors = {}

  // Username Validation
  if (!values.username) {
    errors.username = [{ message: 'Username is required' }]
  } else if (values.username.includes(' ')) {
    errors.username = [{ message: 'Username cannot contain spaces!' }]
  } else if (values.username.length < 5) {
    errors.username = [{ message: 'username must be at least 5 characters long!' }]
  } else if (values.username.length > 25) {
    errors.username = [{ message: 'username must be less than 25 characters long!' }]
  }

  // FirstName Validation
  if (!values.firstName) {
    errors.firstName = [{ message: 'First Name is required' }]
  } else if (values.firstName.length > 25) {
    errors.firstName = [{ message: 'First Name must be less than 25 characters long!' }]
  }
  // Passsword Validation
  if (!values.password) {
    errors.password = [{ message: 'Password is required' }]
  } else if (values.password.length < 5) {
    errors.password = [{ message: 'Password must be at least 5 characters long!' }]
  }

  // LastName Validation
  if (!values.lastName) {
    errors.lastName = [{ message: 'Last Name is required' }]
  } else if (values.lastName.length > 25) {
    errors.lastName = [{ message: 'Last Name must be less than 25 characters long!' }]
  }

  //Teams Validation
  if (values.offices.length === 0) {
    errors.offices = [{ message: 'At least one team is required!' }]
  }
  return {
    values,
    errors,
  }
}

const onFormSubmit = async (form: FormSubmitEvent) => {
  if (form.valid) {
    console.log('Form VALID!', form.values)
    const usernameIsAvailable = await isUsernameAvailable(form.values.username)
    if (usernameIsAvailable === false) {
      usernameAvailable.value = false
      return
    }
    usernameAvailable.value = true

    await usersStore.saveNewUser(form.values as User)
    // await officeStore.saveNewOffice(form.values as Office)
    toast.add({
      severity: 'contrast',
      summary: 'Added New User',
      detail: 'New User Created and Saved!',
      life: 2200,
    })

    setTimeout(() => {
      router.push('/users')
    }, 3000)
  }
}
</script>

<template>
  <ConfirmDialog />
  <Toast style="max-width: 300px" />

  <ScrollPanel style="width: 100%; height: 100%">
    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
      <div class="form-group" v-motion-pop-visible>
        <h3>Username</h3>
        <InputText name="username" type="text" placeholder="Username" fluid />
        <Message v-if="$form.username?.invalid" severity="error" variant="simple">{{
          $form.username?.error?.message
        }}</Message>
        <Message v-if="!usernameAvailable" severity="error" variant="simple"
          >That Username is Already Taken!</Message
        >
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Password</h3>
        <InputText name="password" type="password" placeholder="Password" fluid />
        <Message v-if="$form.password?.invalid" severity="error" variant="simple">{{
          $form.password?.error?.message
        }}</Message>
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>First Name</h3>
        <InputText name="firstName" type="text" placeholder="First Name" fluid />
        <Message v-if="$form.firstName?.invalid" severity="error" variant="simple">{{
          $form.firstName?.error?.message
        }}</Message>
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Last Name</h3>
        <InputText name="lastName" type="text" placeholder="Last Name" fluid />
        <Message v-if="$form.lastName?.invalid" severity="error" variant="simple">{{
          $form.lastName?.error?.message
        }}</Message>
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Role</h3>
        <Select
          name="role"
          v-model="selectedRole"
          :options="props.possibleRoles"
          optionValue="value"
          optionLabel="name"
          fluid
        ></Select>
        <Message v-if="$form.role?.invalid" severity="error" variant="simple">{{
          $form.role?.error?.message
        }}</Message>
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Teams</h3>
        <MultiSelect
          placeholder="Select Assigned Teams"
          name="offices"
          filter
          optionLabel="name"
          :options="props.possibleOffices"
          optionValue="_id"
          style="display: flex"
        ></MultiSelect>
        <Message v-if="$form.offices?.invalid" severity="error" variant="simple">{{
          $form.offices?.error?.message
        }}</Message>
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Supervisor</h3>
        <Select
          :options="possibleSupervisors"
          filter
          name="supervisor"
          placeholder="Select a Supervisor"
          optionValue="_id"
          :optionLabel="getFullName"
        ></Select>
        <Message v-if="$form.supervisor?.invalid" severity="error" variant="simple">{{
          $form.supervisor?.error?.message
        }}</Message>
      </div>

      <div class="form-buttons" v-motion-pop-visible>
        <Button type="submit" severity="info" label="Create" icon="pi pi-plus" />
      </div>
    </Form>
  </ScrollPanel>
</template>
