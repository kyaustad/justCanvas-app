import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import type { Pin } from '../types/pin';
import { useAuthStore } from './authStore';
import { useOfficeStore } from './officeStore';
import { useSettingsStore } from './settingsStore';
import { useAxios } from '@vueuse/integrations/useAxios';
import type { Coordinate } from 'ol/coordinate';


export const usePinStore = defineStore('pinStore', () => {
    const authStore = useAuthStore();
    const officeStore = useOfficeStore();
    const settingsStore = useSettingsStore();
    const userPins = ref<Pin[]>([]);
    const selectedPin = ref<Pin>();
    
    const fetchUserPins = async (userId: string | undefined) => {
        const timeFrame = (parseInt(settingsStore.pinAgeFilter ? settingsStore.pinAgeFilter : '2') * 24 * 60 * 60 * 1000)
        const timeFilter = Date.now() - timeFrame
        
        if (!userId) {
            console.log('ERROR FETCHING PINS')
            throw new Error('UserID for request was undefined')
            
        }


        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/pins?owner=${userId}&office=${officeStore.activeOffice?._id}&createdAt[gte]=${timeFilter}`, {
            method: 'GET',
            withCredentials: true,
        })

        if (error.value) {
            console.error('Error Fetching Pins:', error.value);
            throw error.value;
        }

        // console.log(`https://${authStore.company}.justcanvas.app/api/v1/pins?owner=${userId}`)

        // userPins.value = data.value.data.pins;
        console.log(`Retrieved ${data.value.data.pins.length} pins!`);
        return data.value.data.pins;
    };

    const saveNewPin = async (newPin: Pin) => {
        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/pins`, {
            method: 'POST',
            withCredentials: true,
            data: newPin
        })

        if (error.value) {
            console.error('Error saving pin to server:', error.value);
            throw error.value;
        }

        const savedPin = data.value.data.pin
        userPins.value.push(savedPin);

    }
    const findPinFromCoords = async (coords: Coordinate) => {
        const matchingPin = userPins.value.find(pin => pin.coordinates.coordinates[0] === coords[0] && pin.coordinates.coordinates[1] === coords[1])
        return matchingPin
    }

    const setUserPins = (pins: Pin[]) => {
        userPins.value = pins;
    }

    const deletePin = async (pinId: string | undefined) => {
        if (!pinId) {
            return false
        }
        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/pins/${pinId}`, {
            method: 'DELETE',
            withCredentials: true
        })

        if (error.value) {
            console.log('Error Deleting Pin:', error.value)
            return false;
        } else if (!error.value) {
            console.log('Delete Success!', data.value)
            const pinIndex = userPins.value.findIndex(pin => pin._id === pinId);
            if (pinIndex !== -1) {
                userPins.value.splice(pinIndex, 1);
            }
            return true;
        }

    }

    const updatePin = async (newPin: Pin | undefined) => {
        if (!newPin?._id) {
            return false
        }
        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/pins/${newPin._id}`, {
            method: 'PATCH',
            withCredentials: true,
            data: newPin
            
        })

        if (error.value) {
            console.log('Error updating Pin', error.value)
            return false
        } else if (!error.value)  {
            console.log('Update Success!', data.value)
            const pinIndex = userPins.value.findIndex(pin => pin._id === newPin._id)

            if (pinIndex !== -1) {
                userPins.value[pinIndex] = data.value.data.pin
            }
            return true
        }



    }

   

    return { userPins, updatePin, fetchUserPins, saveNewPin, findPinFromCoords, setUserPins, selectedPin, deletePin };
})