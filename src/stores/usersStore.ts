import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import { useOfficeStore } from "./officeStore";
import { ref } from "vue";

import type { User } from "../types/user";
import { useAxios } from "@vueuse/integrations/useAxios";

export const useUsersStore = defineStore('usersStore', () => {
    const authStore = useAuthStore()
    const officeStore = useOfficeStore()
    const allUsers = ref<User[]>([]);
    const filteredUsers = ref<User[]>([]);
    const activeViewedUser = <User>({});

    const fetchUserFromId = async (userId: string) => {

        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/users/${userId}`, {
            method: 'GET',
            withCredentials: true,
        })

        if (error.value) {
            console.error('Error Fetching Pins:', error.value)
            throw error.value
        }

        return data.value.data.user
    }

    const fetchAllUsersBasedOnRole = async () => {
        let queryString = '';
        if (authStore.user.role === 1) {
            queryString = `?offices=${officeStore.activeOffice?._id}&role[lt]=${authStore.user.role}`
        } else if (authStore.user.role === 2 ){
            queryString = `?role[lte]=${authStore.user.role}`
        }


        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/users${queryString}`, {
            method: 'GET',
            withCredentials: true
        })

        if (error.value) {
            console.error('Error Fetching Users:', error.value)
            throw error.value
        }

        allUsers.value = data.value.data.users

    }

    const fetchAllUsersInActiveOffice = async () => {
        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/users?offices=${officeStore.activeOffice?._id}`, {
            method: 'GET',
            withCredentials: true
        })

        if (error.value) {
            throw error.value
        }

        allUsers.value = data.value.data.users
    }

    const saveNewUser = async (newUser: User) => {
        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/users`, {
            method: 'POST',
            withCredentials: true,
            data: newUser
        })

        if (error.value) {
            console.error('Error Saving User', error.value)
            throw error.value
        }

        const savedUser = data.value.data.user
        allUsers.value.push(savedUser);
    }
    
    const deleteUser = async (userId: string | undefined) => {
        if (!userId) {
            return false
        }
        const { data, error} = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/users/${userId}`, {
            method: 'DELETE',
            withCredentials: true
        })

        if (error.value) {
            console.log('Error deleting user:', error.value)
            return false
        } else if (!error.value) {
            console.log('Delete Success!') 
            const userIndex = allUsers.value.findIndex(user => user._id === userId)
            if (userIndex !== -1) {
                allUsers.value.splice(userIndex, 1)
                filteredUsers.value.splice(userIndex, 1)
            }
            
            return true;
        }
    }

    const updateUser = async (newUser: User | undefined) => {
        if (!newUser?._id) {
            return false
        }
        const { data, error } = await useAxios(`https://${authStore.company}.justcanvas.app/api/v1/users/${newUser._id}`, {
            method: 'PATCH',
            withCredentials: true,
            data: newUser
        })

        if (error.value) {
            console.log('Error updating user', error.value)
            return false
        } else if (!error.value) {
            console.log('Update Success!', data.value)
            const userIndex = allUsers.value.findIndex(user => user._id === newUser._id)

            if (userIndex !== -1) {
                allUsers.value[userIndex] = data.value.data.user
                filteredUsers.value = [...allUsers.value].sort((a, b) => {
                    return b.lastName.localeCompare(a.lastName)
                  })
            }
            return true
        }
    }


    return { activeViewedUser, updateUser, deleteUser, allUsers, fetchUserFromId, fetchAllUsersBasedOnRole, saveNewUser, filteredUsers, fetchAllUsersInActiveOffice }
})