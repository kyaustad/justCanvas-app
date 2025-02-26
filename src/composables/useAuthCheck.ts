import type { Router } from "vue-router";
import { useAuthStore } from "../stores/authStore";


export async function useAuthCheck(router: Router) {
    const authStore = useAuthStore();
    

    const checkAuthStatus = async () => {
        const isAuth = await authStore.checkAuth();
        
        if (isAuth) {
            console.log('Is Authorized/Logged In');
        } else {
            router.push('/login');
        }
    }
    return { checkAuthStatus };
}