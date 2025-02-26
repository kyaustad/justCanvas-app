<script setup lang="ts">
import { View } from 'ol'
import { ref, computed } from 'vue'
import {
  locationIcon,
  locationIconBlack,
  pinRed,
  pinBlue,
  pinGray,
  pinGreen,
  pinBlack,
  pinWhite,
  pinBlank,
} from '../assets/icons'

import type { ObjectEvent } from 'ol/Object'
import type { DrawEvent } from 'ol/interaction/Draw'

import { useSettingsStore } from '../stores/settingsStore'
import { usePinStore } from '../stores/pinStore'
import { useAreaStore } from '../stores/areaStore'

import { useOfficeStore } from '../stores/officeStore'
import { getPinImageFromType } from '../composables/getPinImageFromType'
import type Map from 'ol/Map'
import type { Area } from '../types/area'
import type { Polygon } from 'ol/geom'
import type { Layer } from 'ol/layer'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const pinStore = usePinStore()
const settingsStore = useSettingsStore()
const areaStore = useAreaStore()

const officeStore = useOfficeStore()

const center = ref(settingsStore.cachedCoords ? settingsStore.cachedCoords : [-90, 40])
const projection = ref('EPSG:4326')
const zoom = ref(15)

const view = ref<View>()
const map = ref<{ map: Map }>()
const position = ref([])

const newArea = ref<Area>({
  type: 'Polygon',
  geometry: {
    type: 'Polygon',
    coordinates: [[[0]]],
  },
  office: officeStore.activeOffice?._id || '',
})

const tileUrl = computed(() => {
  return `https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=${apiKey}`
})

const attributions = computed(() => {
  return '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>'
})

const apiKey = 'rfHFqW8F6s58RE0s7tPb'

// const emit = defineEmits<{
//   (event: 'draw-area-end'): void
//   (event: 'map-moved'): void
//   (event: 'moving-stopped'): void
// }>()

// const drawAreaEnd = () => {
//   emit('draw-area-end')
// }

// const mapMoved = () => {
//   emit('map-moved')
// }
// const movingStopped = () => {
//   emit('moving-stopped')
// }

const props = defineProps<{
  drawEnable: boolean
  areaSelectEnabled: boolean
  drawType: string
  clickEvent: PointerEvent | null
}>()

let startingViewSet = false

const geoLocChange = (event: ObjectEvent) => {
  position.value = event.target.getPosition()
  settingsStore.cachedCoords = position.value
  if (!startingViewSet) {
    view.value?.setCenter(event.target?.getPosition())

    startingViewSet = true
  }
}

const drawStart = (event: DrawEvent) => {
  console.log(areaStore.userAreas)
  console.log(event)
}

const drawEnd = (event: DrawEvent) => {
  const feature = event.feature
  const geometry = feature.getGeometry() as Polygon

  newArea.value.geometry.coordinates = geometry?.getCoordinates()

  console.log('new area:', newArea.value)
  areaStore.saveNewArea(newArea.value)
  toast.add({
    severity: 'secondary',
    summary: 'Added New Area',
    detail: 'New Area Drawn and Saved to the Server!',
    life: 3000,
  })
  //emit('draw-area-end')
}

const determineCoordsFromPixel = (event: PointerEvent | null) => {
  if (event !== null) {
    const pixel = map.value?.map.getEventPixel(event)
    if (pixel) {
      const pixelCoords = map.value?.map.getCoordinateFromPixel(pixel)
      return pixelCoords
    }
  }
}
const getFeaturesAtClick = (event: PointerEvent | null) => {
  if (event !== null && map.value) {
    const pixel = map.value?.map.getEventPixel(event)
    if (pixel) {
      const feature = map.value?.map.forEachFeatureAtPixel(
        pixel,
        function (feature) {
          return feature
        },
        { layerFilter: layerFilter }
      )
      return feature
    }
  }
}

const layerFilter = function (layer: Layer) {
  return layer.get('className') === (props.areaSelectEnabled ? 'area-layer' : 'pin-layer')
}

defineExpose({
  determineCoordsFromPixel,
  getFeaturesAtClick,
})
</script>

<template>
  <ol-map
    style="height: 100%"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    ref="map"
  >
    <ol-view :center="center" ref="view" :zoom="zoom" :projection="projection"></ol-view>

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-tile-layer :opacity="settingsStore.mapOpacity">
      <ol-source-xyz :url="tileUrl" :attributions="attributions" />
    </ol-tile-layer>

    <ol-vector-layer className="pin-layer">
      <ol-source-vector :projection="projection">
        <ol-feature v-for="pin in pinStore.userPins" :key="pin._id">
          <ol-geom-point :coordinates="pin.coordinates.coordinates"></ol-geom-point>
          <ol-style>
            <ol-style-icon :src="getPinImageFromType(pin.type)" :scale="0.065"></ol-style-icon>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>

    <ol-vector-layer className="area-layer">
      <ol-source-vector :projection="projection">
        <ol-feature v-for="area in areaStore.userAreas" :key="area._id">
          <ol-geom-polygon :coordinates="area.geometry.coordinates"></ol-geom-polygon>
          <ol-style>
            <ol-style-stroke
              :color="`#${settingsStore.areaLineColor}`"
              :width="2"
            ></ol-style-stroke>
            <ol-style-fill :color="settingsStore.areaFillColor"></ol-style-fill>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>

    <ol-vector-layer>
      <ol-source-vector :projection="projection">
        <ol-interaction-draw
          v-if="props.drawEnable"
          :type="props.drawType"
          @drawend="drawEnd"
          @drawstart="drawStart"
        >
          <ol-style>
            <ol-style-stroke
              :color="`#${settingsStore.areaLineColor}`"
              :width="2"
            ></ol-style-stroke>
            <ol-style-fill :color="settingsStore.areaFillColor"></ol-style-fill>
            <ol-style-circle :radius="5">
              <ol-style-fill color="blue" />
              <ol-style-stroke color="white" :width="2" />
            </ol-style-circle>
          </ol-style>
        </ol-interaction-draw>
      </ol-source-vector>
      <ol-style>
        <ol-style-stroke color="rgba(0, 0, 0, 0)" :width="2"></ol-style-stroke>
        <ol-style-fill color="rgba(0, 0, 0, 0)"></ol-style-fill>
      </ol-style>
    </ol-vector-layer>

    <!-- Geolocation and location Pin layer -->
    <ol-geolocation :projection="projection" @change:position="geoLocChange">
      <template>
        <ol-vector-layer>
          <ol-source-vector>
            <ol-feature>
              <ol-geom-point :coordinates="position"></ol-geom-point>
              <ol-style>
                <ol-style-icon :src="locationIcon" :scale="0.04"></ol-style-icon>
              </ol-style>
            </ol-feature>
          </ol-source-vector>
        </ol-vector-layer>
      </template>
    </ol-geolocation>

    <ol-rotate-control />
  </ol-map>
</template>
<style scoped>
.ol-map {
  position: relative;
}
.ol-map-loading:after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  margin-left: -20px;
  border-radius: 50%;
  border: 5px solid rgba(180, 180, 180, 0.6);
  border-top-color: var(--vp-c-brand-1);
  animation: spinner 0.6s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
