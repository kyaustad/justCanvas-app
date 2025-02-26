import type { Area } from "../types/area";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore";
import { useOfficeStore } from "./officeStore";
import { useAxios } from "@vueuse/integrations/useAxios";
import type { Coordinate } from "ol/coordinate";

export const useAreaStore = defineStore('areaStore', () => {
    const authStore = useAuthStore();
    const officeStore = useOfficeStore();
    const userAreas = ref<Area[]>([]);
    const selectedArea = ref<Area>();

    const fetchUserAreas = async () => {

        const queryString = authStore.user.role > 0 ? `?office=${officeStore.activeOffice?._id}` : `?owners=${authStore.user._id}`;
        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/areas${queryString}`, {
            method: 'GET',
            withCredentials: true,
        });
        
        if (error.value) {
            console.error('Error Fetching Areas:', error.value);
            throw error.value
        }


        userAreas.value = data.value.data.areas;
        console.log(`Retreived ${userAreas.value.length} areas for current user!`);
        return data.value.data.areas;
    }

    const saveNewArea = async (newArea: Area) => {
        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/areas`, {
            method: 'POST',
            withCredentials: true,
            data: newArea
        })

        if (error.value) {
            console.error('Error saving area to server:', error.value);
            throw error.value
        }

        console.log('Response Data:', data)
        const savedArea = data.value.data.area
        userAreas.value.push(savedArea);
    }

    const findAreaFromCoords = async (coords: Array<Array<Array<number>>>) => {
        const matchingArea = userAreas.value.find(area => 
            area.geometry.coordinates[0].length === coords[0].length &&
            area.geometry.coordinates[0].every((point, index) => 
                point[0] === coords[0][index][0] && point[1] === coords[0][index][1])
        )
        return matchingArea
    }

    const deleteArea = async (areaId: string | undefined) => {
        if (!areaId) {
            return false
        }

        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/areas/${areaId}`, {
            method: 'DELETE',
            withCredentials: true
        })

        if (error.value ) {
            console.log('Error deleting Area!', error.value)
            return false
        } else if (!error.value) {
            console.log('Delete success!')
            const areaIndex = userAreas.value.findIndex(area => area._id === areaId);
            if (areaIndex !== -1) {
                userAreas.value.splice(areaIndex, 1)
            }
            return true
        }
    }

    const fetchSingleArea = async (areaId: string | undefined) => {
        if (!areaId) {
            return
        }

        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/areas/${areaId}`, {
            method: 'GET',
            withCredentials: true
        })

        if (error.value) {
            console.error(error.value)
            throw error.value
        } else if (!error.value) {
            console.log('Fetched single area')
            return data.value.data.area
        }

    }

    const updateArea = async (newArea: Area | undefined) => {
        if (!newArea?._id) {
            return false
        }

        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/areas/${newArea._id}`, {
            method: 'PATCH',
            withCredentials: true,
            data: newArea
        })

        if (error.value) {
            console.log('Error updating Area:', error.value)
            return false
        } else if (!error.value) {
            console.log('Updating Success!')
            const areaIndex = userAreas.value.findIndex(area => area._id === newArea._id)

            if (areaIndex !== -1) {
                userAreas.value[areaIndex] = data.value.data.area
            }
            return true
        }
    }

    return { userAreas, selectedArea, fetchUserAreas, saveNewArea, fetchSingleArea, updateArea, findAreaFromCoords, deleteArea };
})
