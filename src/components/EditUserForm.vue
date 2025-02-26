<script setup lang="ts">
import { Form, type FormResolverOptions, type FormSubmitEvent } from '@primevue/forms'
import {
  InputText,
  Message,
  Button,
  ScrollPanel,
  Select,
  MultiSelect,
  useToast,
  useConfirm,
} from 'primevue'
import { ref, onMounted } from 'vue'
import { useAxios } from '@vueuse/integrations/useAxios'

import { useUsersStore } from '../stores/usersStore'
import { useAuthStore } from '../stores/authStore'
import type { User } from '../types/user'
import { useRouter, useRoute } from 'vue-router'

import type { Office } from '../types/office'

const toast = useToast()
const confirm = useConfirm()

const usersStore = useUsersStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const usernameAvailable = ref(true)
const userId = ref()
const usernameChanged = ref(false)
const passwordChanged = ref(false)

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

interface FormUser {
  _id?: string
  username: string
  password?: string
  firstName: string
  lastName: string
  createdAt?: Date
  role: number
  offices: Office[] | string[]
  supervisor?: User | string
}

const newUser = ref<FormUser>({
  _id: usersStore.activeViewedUser._id || '',
  username: usersStore.activeViewedUser.username || '',
  firstName: usersStore.activeViewedUser.firstName || '',
  lastName: usersStore.activeViewedUser.lastName || '',
  role: usersStore.activeViewedUser.role || 0,
  offices: usersStore.activeViewedUser.offices
    ? usersStore.activeViewedUser.offices.map((office) => office._id as string)
    : [],
  supervisor: usersStore.activeViewedUser.supervisor?._id,
})

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
  if (passwordChanged.value === true && values.password.length < 5) {
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
    let usernameIsAvailable = false
    if (usernameChanged.value === true) {
      usernameIsAvailable = await isUsernameAvailable(form.values.username)
    } else if (usernameChanged.value === false) {
      usernameIsAvailable = true
    }

    if (usernameIsAvailable === false) {
      usernameAvailable.value = false
      return
    }
    usernameAvailable.value = true
    usernameChanged.value = false
    passwordChanged.value = false

    await usersStore.updateUser(newUser.value as User)
    console.log('Submitted USER:', newUser.value as User)
    toast.add({
      severity: 'contrast',
      summary: 'Updated User',
      detail: 'User Updated and Saved!',
      life: 2200,
    })

    setTimeout(() => {
      router.push('/users')
    }, 3000)
  }
}

const confirmDeleteUser = () => {
  confirm.require({
    message: 'Are you sure you want to delete this user?',
    header: 'Delete?',
    icon: 'pi pi-trash',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    rejectIcon: 'pi pi-times-circle',
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    acceptIcon: 'pi pi-trash',
    accept: async () => {
      const success = await usersStore.deleteUser(newUser.value._id)

      if (!success) {
        toast.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'There was a problem deleting the user!',
          life: 2500,
        })
        return
      }

      toast.add({
        severity: 'secondary',
        summary: 'Deleted!',
        detail: 'Deleted User!',
        life: 2500,
      })

      setTimeout(() => {
        router.back()
      }, 2650)
    },
    reject: () => {},
  })
}
const handlePasswordChanged = () => {
  console.log('Password Changed')
  passwordChanged.value = true
}
const handleUsernameChanged = () => {
  console.log('Username Changed')
  usernameChanged.value = true
}

onMounted(async () => {
  userId.value = route.params.id
  usersStore.activeViewedUser = await usersStore.fetchUserFromId(userId.value)
})
</script>

<template>
  <ScrollPanel style="width: 100%; height: 100%">
    <Form v-slot="$form" :initialValues="newUser" :resolver @submit="onFormSubmit">
      <div class="form-group" v-motion-pop-visible>
        <h3>Username</h3>
        <InputText
          @update:modelValue="handleUsernameChanged"
          name="username"
          v-model="newUser.username"
          type="text"
          placeholder="Username"
          fluid
        />
        <Message v-if="$form.username?.invalid" severity="error" variant="simple">{{
          $form.username?.error?.message
        }}</Message>
        <Message v-if="!usernameAvailable" severity="error" variant="simple"
          >That Username is Already Taken!</Message
        >
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>New Password</h3>
        <InputText
          @value-change="handlePasswordChanged"
          name="password"
          v-model="newUser.password"
          type="password"
          placeholder="Password"
          fluid
        />
        <Message v-if="$form.password?.invalid" severity="error" variant="simple">{{
          $form.password?.error?.message
        }}</Message>
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>First Name</h3>
        <InputText
          name="firstName"
          v-model="newUser.firstName"
          type="text"
          placeholder="First Name"
          fluid
        />
        <Message v-if="$form.firstName?.invalid" severity="error" variant="simple">{{
          $form.firstName?.error?.message
        }}</Message>
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Last Name</h3>
        <InputText
          name="lastName"
          v-model="newUser.lastName"
          type="text"
          placeholder="Last Name"
          fluid
        />
        <Message v-if="$form.lastName?.invalid" severity="error" variant="simple">{{
          $form.lastName?.error?.message
        }}</Message>
      </div>

      <div class="form-group" v-motion-pop-visible>
        <h3>Role</h3>
        <Select
          name="role"
          v-model="newUser.role"
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
          v-model="newUser.offices"
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
          v-model="newUser.supervisor"
          name="supervisor"
          placeholder="Select a Supervisor"
          optionValue="_id"
          :optionLabel="getFullName"
        ></Select>
        <Message v-if="$form.supervisor?.invalid" severity="error" variant="simple">{{
          $form.supervisor?.error?.message
        }}</Message>
      </div>

      <div class="option-container more-space" v-motion-pop-visible>
        <Button
          v-if="newUser._id !== authStore.user._id"
          severity="danger"
          @click="confirmDeleteUser"
          label="Delete"
          icon="pi pi-trash"
        />
        <Button type="submit" severity="success" label="Save" icon="pi pi-save" />
      </div>
    </Form>
  </ScrollPanel>
</template>
