import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'

import "primeicons/primeicons.css";

import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import router from './router/router';
import OpenLayersMap from 'vue3-openlayers';
import { MotionPlugin } from '@vueuse/motion';
import { ConfirmationService, ToastService } from 'primevue';

import { useAuthCheck } from './composables/useAuthCheck';

const pinia = createPinia();

const app = createApp(App);



app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
}).use(router).use(OpenLayersMap).use(pinia).use(MotionPlugin).use(ToastService).use(ConfirmationService);

const initAuthCheck = async () => {
    const { checkAuthStatus } = await useAuthCheck(router);
    checkAuthStatus();
}

initAuthCheck();
app.mount('#app')
