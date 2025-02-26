import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";



const routes = [
    {
        path: '/', component: () => import('../views/HomeView.vue')
    },
    {
        path: '/pin-history/:id', 
        component: () => import('../views/PinHistoryView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/pin/:id', 
        component: () => import('../views/ViewPinView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/menu', 
        component: () => import('../views/MenuView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/login', component: () => import('../views/LoginView.vue')
    },
    {
        path: '/office-select', 
        component: () => import('../views/OfficeSelectView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/users', 
        component: () => import('../views/AllUsersView.vue'),
        meta: { requiresAuth: true, requiresManager: true }
    },
    {
        path: '/users/:id', 
        component: () => import('../views/ViewUserView.vue'),
        meta: { requiresAuth: true, requiresManager: true }
    },
    {
        path: '/users/add-user', 
        component: () => import('../views/AddUserView.vue'),
        meta: { requiresAuth: true, requiresManager: true }
    },
    {
        path: '/teams', 
        component: () => import('../views/AllOfficesView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/teams/:id', 
        component: () => import('../views/ViewOfficeView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/teams/add-team', 
        component: () => import('../views/AddOfficeView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
     if (to.meta.requiresManager && authStore.user.role < 1) {
        next('/');
    } else if (to.meta.requiresAdmin && authStore.user.role < 2) {
        next('/')
    } else {
        next();
    }
    
    
})

export default router;