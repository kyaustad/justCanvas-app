import { defineStore } from "pinia";
import { ref, watch } from "vue";
import Cookies from "js-cookie";

export const useSettingsStore = defineStore('settingsStore', () => {
    const mapOpacity = ref(0);
    const areaFillColor = ref<string | undefined>("rgba(0, 106, 255, 0.15)")
    const areaLineColor = ref<string | undefined>("001aff")
    const pinAgeFilter = ref<string | undefined>('2')
   
    const cachedCoords = <Array<number> | null>null;

    watch(areaFillColor, (newColor) => {
        Cookies.set('areaFillColor', (newColor || "rgba(0, 106, 255, 0.15)"));
    })

    watch(areaLineColor, (newColor) => {
        Cookies.set('areaLineColor', newColor || "001aff")
    })
    watch(pinAgeFilter, (newPinAge) => {
        Cookies.set('pinAgeFilter', (`${newPinAge}`))
    })

    if (Cookies.get('areaFillColor')) {
        areaFillColor.value = Cookies.get('areaFillColor')
    }
    if (Cookies.get('areaLineColor')) {
        areaLineColor.value = Cookies.get('areaLineColor');
    }
    if (Cookies.get('pinAgeFilter')) {
        pinAgeFilter.value = Cookies.get('pinAgeFilter')
    }

    return { mapOpacity, areaFillColor, areaLineColor, cachedCoords, pinAgeFilter }
})
