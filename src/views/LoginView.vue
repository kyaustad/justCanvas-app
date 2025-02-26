<script setup lang="ts">
import { ref } from 'vue'
import { FloatLabel, InputText, Button } from 'primevue'
import BottomBar from '../components/BottomBar.vue'
import { useAuthStore } from '../stores/authStore'
import { useOfficeStore } from '../stores/officeStore'
import { useRouter } from 'vue-router'
import { useToast, Toast } from 'primevue'

const router = useRouter()
const authStore = useAuthStore()
const officeStore = useOfficeStore()

const toast = useToast()

const formData = ref({
  username: '',
  password: '',
  company: '',
})

interface CustomError {
  response?: {
    data?: {
      message?: string
    }
  }
}

const handleLogin = async () => {
  try {
    await authStore.login(formData.value)
    console.log('Logged in successfully')
    toast.add({
      severity: 'secondary',
      summary: 'Login Success!',
      detail: 'Logged In Successfully!',
      life: 2500,
    })

    if (authStore.user.offices.length < 2) {
      officeStore.setActiveOffice(authStore.user.offices[0]._id || '')
    }
    router.push(authStore.user.offices.length > 1 ? '/office-select' : '/')
  } catch (err) {
    console.error('Login Error:', err)

    const errorMessage = (err as CustomError)?.response?.data?.message ?? 'Company Invalid!'

    toast.add({
      severity: 'error',
      summary: 'Login Failed!',
      detail: `${errorMessage}`,
      life: 5000,
    })
  }
}
</script>

<template>
  <Toast style="max-width: 300px"></Toast>
  <div class="background">
    <div
      class="login-container"
      v-motion
      :initial="{ opacity: 0, y: 100, scale: 0.75 }"
      :enter="{ opacity: 1, y: 0, scale: 1 }"
      :variants="{ custom: { scale: 2 } }"
      :delay="300"
      :duration="1500"
    >
      <div class="login-items">
        <img
          src="/banner_colored_transparent.png"
          style="width: 200px"
          v-motion
          :initial="{ opacity: 0, y: 100 }"
          :enter="{ opacity: 1, y: 0, scale: 1 }"
          :variants="{ custom: { scale: 2 } }"
          :delay="200"
          :hovered="{ scale: 1.1 }"
          :duration="1000"
        />
        <form style="justify-content: center; align-items: center" @submit.prevent="handleLogin">
          <FloatLabel style="margin-top: 30px">
            <InputText id="username" v-model="formData.username" />
            <label style="color: white" for="username">Username</label>
          </FloatLabel>
          <FloatLabel style="margin-top: 30px">
            <InputText type="password" id="password" v-model="formData.password" />
            <label style="color: white" for="password">Password</label>
          </FloatLabel>
          <FloatLabel style="margin-top: 30px">
            <InputText id="company" v-model="formData.company" />
            <label style="color: white" for="company">Company</label>
          </FloatLabel>
          <Button
            type="submit"
            style="margin-top: 40px; margin-left: 50px"
            label="Login"
            severity="secondary"
            icon="pi pi-sign-in"
          ></Button>
        </form>
      </div>
    </div>
    <BottomBar v-if="authStore.isAuthenticated" />
  </div>
</template>

<style lang="css" scoped>
.background {
  background-color: #468c78;
  align-items: center;
  justify-content: center;
  display: grid;
  height: calc(100vh);
}
.login-container {
  background-color: #34d399;
  border-radius: 20px;
  box-shadow: 15px 15px 10px #44444489;
  height: 70%;
  margin-bottom: 20px;
}
.login-items {
  padding: 30px;

  display: grid;
  align-items: center;
  justify-content: center;
}
</style>
