import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAxios } from "@vueuse/integrations/useAxios";

import type { User } from "../types/user";
import type { Office } from "../types/office";
import type { Credentials } from "../types/credentials";

import { usePinStore } from "./pinStore";
import { useOfficeStore } from "./officeStore";


import { getCookieValue } from "../composables/getCookieValue";
import { useAreaStore } from "./areaStore";



export const useAuthStore = defineStore('authStore', () => {
    const pinStore = usePinStore();
    const officeStore = useOfficeStore();
    const areaStore = useAreaStore();

    const defaultUser = {
        _id: '',
        username: '',
        firstName: '',
        lastName: '',
        role: 0,
        offices: <Office[]>[],
        
    }

    const user = ref<User>(defaultUser)
    const isAuthenticated = computed(() => user.value._id !== '' && company.value !== '');
    const company = ref<string | null>('');

    const login = async (credentials: Credentials) => {
        company.value = credentials.company;
        const { data, error } = await useAxios(
            `https://${company.value}.justcanvas.app/api/v1/auth/login`, {
                method: 'POST',
                data: credentials,
                withCredentials: true,
            }
        );

        if (error.value) {
            console.error('Login Failed:', error.value);
            user.value = defaultUser;
            throw error.value;
        }

        user.value = data.value.user;
        document.cookie = `company=${credentials.company}; path=/; max-age=${30 * 24 * 60 * 60}`;
       
    };

    const checkAuth = async () => {
        const companyCookieFound = document.cookie.split(';').some((cookie) => cookie.trim().startsWith('company='));
        if (!companyCookieFound) {
            console.log('Couldnt find company');
            return;
        }

        console.log('Found companyCookie = ', companyCookieFound)

        const companyCookie = getCookieValue('company');

        console.log('Company value:', companyCookie);

        const { data, error } = await useAxios(
            `https://${companyCookie}.justcanvas.app/api/v1/auth/me`, {
                method: 'GET',
                withCredentials: true,
            }
        );
        // console.log('Axios Results:', data.value, error.value)
        if (error.value) {
            user.value = defaultUser;
            
            console.warn('User not authenticated!');
            return false;
        }

        //Update state from logged in user
        user.value = data.value.user;
        company.value = companyCookie;
        officeStore.checkForActiveOffice();
        if (officeStore.activeOffice){
            pinStore.userPins = await pinStore.fetchUserPins(user.value._id as string);
            areaStore.userAreas = await areaStore.fetchUserAreas();
        }
        
       

        return true;
        
    };

    const logout  = async () => {


        user.value = defaultUser;
        
        
    };

    return { user, isAuthenticated, login, checkAuth, logout, company };
});