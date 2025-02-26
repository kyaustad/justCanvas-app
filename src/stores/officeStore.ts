import { defineStore } from "pinia";
import { ref } from "vue";

import { useAuthStore } from "./authStore";

import type { Office } from "../types/office";
import { getCookieValue } from "../composables/getCookieValue";
import { useRouter } from "vue-router";
import { useAxios } from "@vueuse/integrations/useAxios";


export const useOfficeStore = defineStore('officeStore', () => {
    const authStore = useAuthStore();
    
    const router = useRouter();

    const activeOffice = ref<Office>();
    const allOffices = ref<Office[]>([]);
    const filteredOffices = ref<Office[]>([]);

    const setActiveOffice = (officeId: string) => {
        const activeIndex = authStore.user.offices.findIndex((office) => office._id === officeId);

        activeOffice.value = authStore.user.offices[activeIndex];
        document.cookie = `office=${officeId}; path=/; max-age=${30 * 24 * 60 * 60}`;
    }

    const checkForActiveOffice = () => {
        const officeCookieFound = document.cookie.split(';').some((cookie) => cookie.trim().startsWith('office='));

        if (officeCookieFound) {
            const cookieValue = getCookieValue('office');
            const foundIndex = authStore.user.offices.findIndex((office) => office._id === cookieValue);
            activeOffice.value = authStore.user.offices[foundIndex];
            console.log('Active Office', activeOffice.value)
            
        } else if (!officeCookieFound) {
            router.push('/office-select');
        }
    }

    const getAllOffices = async () => {
        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/offices`, {
            method: 'GET',
            withCredentials: true
        })

        if (error.value) {
            console.log('Error Fetching Offices', error.value)
            throw error.value
        }

        console.log('Got Offices:', data.value.results)
        allOffices.value = data.value.data.offices
    }  

    const saveNewOffice = async (newOffice: Office) => {
        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/offices`, {
            method: 'POST',
            withCredentials: true,
            data: newOffice
        })

        if (error.value) {
            console.error('Error Saving Office', error.value)
            throw error.value
        }

        const savedOffice = data.value.data.office
        allOffices.value.push(savedOffice);
    }

    const deleteOffice = async (officeId: string | undefined) => {
        if (!officeId) {
            return false
        }
        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/offices/${officeId}`, {
            method: 'DELETE',
            withCredentials: true
        })

        if (error.value) {
            console.log('Error Deleting Office:', error.value)
            return false
        } else if (!error.value) {
            console.log('Delete Success!') 
            const officeIndex = allOffices.value.findIndex(office => office._id === officeId);
            if (officeIndex !== -1) {
                allOffices.value.splice(officeIndex, 1)
                filteredOffices.value = allOffices.value
            }
            return true;
        }
    }

    const getSingleOffice = async (officeId: string | undefined) => {
        if (!officeId) {
            return
        }

        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/offices/${officeId}`, {
            method: 'GET',
            withCredentials: true
        })

        if (error.value) {
            console.error('Error getting office:', error.value)
            throw error.value
        }

        return data.value.data.office
    }

    const updateOffice = async (newOffice: Office | undefined) => {
        if (!newOffice?._id) {
            return false
        }

        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/offices/${newOffice._id}`, {
            method: 'PATCH',
            withCredentials: true,
            data: newOffice 
        })

        if (error.value) {
            console.log('Error Updating Office', error.value)
            return false
        } else if (!error.value) {
            console.log('Updating Success!')
            const officeIndex = allOffices.value.findIndex(office => office._id === newOffice._id)

            if (officeIndex !== -1) {
                allOffices.value[officeIndex] = data.value.data.office
            }

            return true;
        }

    }

    return { activeOffice, getSingleOffice, updateOffice, setActiveOffice, deleteOffice, saveNewOffice, filteredOffices, checkForActiveOffice, allOffices, getAllOffices };
})