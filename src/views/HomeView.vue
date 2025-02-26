<script setup lang="ts">
import BottomBar from '../components/BottomBar.vue'
import MapComponent from '../components/MapComponent.vue'
import SettingsButton from '../components/SettingsButton.vue'
import RadialMenu from '../components/RadialMenu.vue'
import ActiveOfficeLabel from '../components/ActiveOfficeLabel.vue'
import PinDialogue from '../components/PinDialogue.vue'
import AreaSelectToggle from '../components/AreaSelectToggle.vue'
import SettingsDrawer from '../components/SettingsDrawer.vue'
import PinSettingsDrawer from '../components/PinSettingsDrawer.vue'
import FeatureSelectDrawer from '../components/FeatureSelectDrawer.vue'
import EditAreaDrawer from '../components/EditAreaDrawer.vue'

import { ref } from 'vue'
import { onLongPress } from '@vueuse/core'
import type { ComponentPublicInstance } from 'vue'

import { Toast, ConfirmDialog } from 'primevue'

import { useAuthStore } from '../stores/authStore'
import { useOfficeStore } from '../stores/officeStore'
import { usePinStore } from '../stores/pinStore'
import { useAreaStore } from '../stores/areaStore'

import type { Pin } from '../types/pin'
import type { Area } from '../types/area'

import type { Point, Polygon } from 'ol/geom'

interface PinSettingsDrawerMethods {
  toggleDrawerVisible: () => void
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
const authStore = useAuthStore()
const officeStore = useOfficeStore()
const pinStore = usePinStore()
const areaStore = useAreaStore()

const radialX = ref(0)
const radialY = ref(0)

const drawConfig = ref({
  drawEnable: false,
  drawType: 'Polygon',
})
const areaSelectEnabled = ref(false)
const areaSelectToggleVisible = ref(false)

const clickEvent = ref<PointerEvent | null>(null)
const changeCount = ref(0)

const htmlRefHook = ref<HTMLElement>()
const longPressedHook = ref(false)
const pinDialogueVisibile = ref(false)
const mapComponentRef = ref()
const settingsDrawerRef = ref<ComponentPublicInstance<PinSettingsDrawerMethods> | null>(null)
const featureSelectDrawerRef = ref<ComponentPublicInstance<PinSettingsDrawerMethods> | null>(null)
const pinSettingsDrawerRef = ref<ComponentPublicInstance<PinSettingsDrawerMethods> | null>(null)
const editAreaDrawerRef = ref<ComponentPublicInstance<PinSettingsDrawerMethods> | null>(null)
const newPin = ref<Pin>({
  coordinates: {
    type: 'Point',
    coordinates: [0, 0],
  },
  owner: `${authStore.user._id}`,
  office: `${officeStore.activeOffice?._id}`,
  type: 'Not Interesed',
})

const selectedPin = ref<Pin>()
const selectedArea = ref<Area>()
const selectMode = ref<'Pin' | 'Area'>('Pin')
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
async function onLongPressCallback(event: PointerEvent) {
  // If we are drawing area, exit immediately
  if (drawConfig.value.drawEnable === true) return
  // Check for features at long press
  if (mapComponentRef.value) {
    const feature = mapComponentRef.value?.getFeaturesAtClick(event)
    if (feature) {
      const featureType = feature.getGeometry().getType()
      if (featureType === 'Point') {
        const pinCoords = (feature.getGeometry() as Point).getCoordinates()
        const foundPin = await pinStore.findPinFromCoords(pinCoords)
        console.log('Found matching pin:', foundPin)
        selectedPin.value = foundPin
        selectMode.value = 'Pin'
        toggleFeatureSelect()
        return
      }
      if (featureType === 'Polygon' && areaSelectEnabled.value) {
        const areaCoords = (feature.getGeometry() as Polygon).getCoordinates()
        console.log('Area Coords:', areaCoords)
        const foundArea = await areaStore.findAreaFromCoords(areaCoords)
        console.log('Found matching area:', foundArea)
        selectedArea.value = foundArea
        selectMode.value = 'Area'
        toggleFeatureSelect()
        return
      }
    }
  }
  //Check if wanting to select area mode is active so as not to open radial
  if (areaSelectEnabled.value) return

  // Standard Pin Dropping and Radial Menu
  clickEvent.value = event
  longPressedHook.value = true
  radialX.value = event.clientX
  radialY.value = event.clientY
  if (mapComponentRef.value) {
    newPin.value.coordinates.coordinates = mapComponentRef.value.determineCoordsFromPixel(event)
  }
}

interface pinInfo {
  address?: string
  city?: string
  state?: string
  zip?: string
  name?: string
  phone?: string
  email?: string
  notes?: string
}

const handleSavedPinClicked = async (pinInfo: pinInfo) => {
  pinDialogueVisibile.value = false
  newPin.value.address = pinInfo.address
  newPin.value.city = pinInfo.city
  newPin.value.state = pinInfo.state
  newPin.value.zip = pinInfo.zip
  newPin.value.name = pinInfo.name
  newPin.value.email = pinInfo.email
  newPin.value.phone = pinInfo.phone
  newPin.value.notes = pinInfo.notes

  await pinStore.saveNewPin(newPin.value)
}

onLongPress(htmlRefHook, onLongPressCallback, {
  modifiers: {
    prevent: true,
  },
})

const hideRadial = () => {
  longPressedHook.value = false
}

const enterAreaMode = () => {
  if (!areaSelectToggleVisible.value) {
    areaSelectToggleVisible.value = true
    drawConfig.value.drawEnable = false
    areaSelectEnabled.value = true
  } else if (areaSelectToggleVisible.value) {
    areaSelectToggleVisible.value = false
    drawConfig.value.drawEnable = false
    areaSelectEnabled.value = false
  }
  // drawConfig.value.drawType = 'Polygon'
  // drawConfig.value.drawEnable = !drawConfig.value.drawEnable
}

const handleClickedPin = (pinType: string) => {
  newPin.value.type = pinType
  pinDialogueVisibile.value = true
}

const handleAreaToggle = () => {
  drawConfig.value.drawEnable = !drawConfig.value.drawEnable
  areaSelectEnabled.value = !areaSelectEnabled.value
}

const handleMapSettings = () => {
  if (settingsDrawerRef.value) {
    settingsDrawerRef.value.toggleDrawerVisible()
  }
}

const handleEditArea = () => {
  if (editAreaDrawerRef.value) {
    editAreaDrawerRef.value.toggleDrawerVisible()
  }
}

const handlePinFilterChanged = async () => {
  pinStore.userPins = await pinStore.fetchUserPins(authStore.user._id as string)
}

const togglePinSettings = () => {
  if (pinSettingsDrawerRef.value) {
    pinSettingsDrawerRef.value.toggleDrawerVisible()
  }
}

const toggleFeatureSelect = () => {
  if (featureSelectDrawerRef.value) {
    featureSelectDrawerRef.value.toggleDrawerVisible()
  }
}

const updateMapComponent = () => {
  changeCount.value += 1
}
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <Toast style="max-width: 300px"> </Toast>
  <div class="map-container" ref="htmlRefHook">
    <MapComponent
      ref="mapComponentRef"
      :key="changeCount"
      :area-select-enabled="areaSelectEnabled"
      :drawEnable="drawConfig.drawEnable"
      :drawType="drawConfig.drawType"
      :clickEvent="clickEvent"
    />
  </div>
  <SettingsButton
    @clicked-map="handleMapSettings"
    @clicked-edit="enterAreaMode"
    @clicked-pin="togglePinSettings"
    :area-permissions="authStore.user?.role >= 1"
  />
  <RadialMenu
    class="radial-menu"
    v-if="longPressedHook"
    :visibility="longPressedHook"
    @clicked-pin="handleClickedPin"
    @menuHidden="hideRadial"
    :style="{ left: radialX - 30 + 'px', top: radialY - 35 + 'px' }"
  />
  <ActiveOfficeLabel />

  <PinDialogue
    class="pin-dialogue"
    :dialogueVisible="pinDialogueVisibile"
    @clicked-close="pinDialogueVisibile = false"
    @clicked-save="handleSavedPinClicked"
    :new-pin-coords="newPin.coordinates.coordinates"
  />

  <SettingsDrawer ref="settingsDrawerRef" @settings-changed="updateMapComponent" />
  <PinSettingsDrawer
    @settings-changed="handlePinFilterChanged"
    ref="pinSettingsDrawerRef"
  ></PinSettingsDrawer>
  <FeatureSelectDrawer
    @edit-area="handleEditArea"
    :selected-area="selectedArea"
    :mode="selectMode"
    :selected-pin="selectedPin"
    ref="featureSelectDrawerRef"
  />
  <EditAreaDrawer ref="editAreaDrawerRef" />
  <BottomBar />
  <AreaSelectToggle v-if="areaSelectToggleVisible" @toggled-modes="handleAreaToggle" />
</template>

<style scoped>
.map-container {
  height: calc(100vh);
  padding-left: 1px;
  padding-right: 1px;
  padding-bottom: 1px;
  padding-top: 1px;
}

.radial-menu {
  position: absolute;
  transform: translate(-50%, -50%);
}
</style>
