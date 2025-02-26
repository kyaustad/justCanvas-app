<script setup lang="ts">
import { Drawer, InputText, Button } from 'primevue'
import { ref } from 'vue'
import { useAxios } from '@vueuse/integrations/useAxios'
import { computed } from 'vue'

const props = defineProps<{
  dialogueVisible: boolean
  newPinCoords: number[]
}>()

const apiUrl = computed(
  () =>
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${props.newPinCoords[1]}&lon=${props.newPinCoords[0]}`
)

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

const pinInfo = ref<pinInfo>({
  address: '',
  city: '',
  state: '',
  zip: '',
  name: '',
  phone: '',
  email: '',
  notes: '',
})

const clickedSave = (pinDetails: pinInfo) => {
  emit('clicked-save', pinDetails)
  pinInfo.value = {
    address: '',
    city: '',
    state: '',
    zip: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
  }
}

const reverseGeoAddress = async () => {
  try {
    if (props.newPinCoords[0] !== undefined && props.newPinCoords[1] !== undefined) {
      const { data, isLoading, error } = await useAxios(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${props.newPinCoords[1]}&lon=${props.newPinCoords[0]}`,
        {
          method: 'GET',
        }
      )
      console.log(data)
      if (data.value?.address) {
        pinInfo.value.address = data.value.address.house_number + ' ' + data.value.address.road
        pinInfo.value.city = data.value.address.city || data.value.address.town
        pinInfo.value.state = data.value.address.state
        pinInfo.value.zip = data.value.address.postcode
      }
    } else {
      return
    }
  } catch (err) {
    console.error('Error looking up address:', err)
  }
}

const emit = defineEmits<{
  (event: 'clicked-save', pinInfo: pinInfo): void
  (event: 'clicked-close'): void
}>()

const handleClickedSave = () => {
  clickedSave(pinInfo.value)
}

const handleClickedClose = () => {
  emit('clicked-close')
}
</script>

<template>
  <Drawer
    :visible="props.dialogueVisible"
    @show="reverseGeoAddress"
    header="Pin Details"
    position="top"
    style="height: auto"
    :block-scroll="true"
  >
    <template #container="{ closeCallback }">
      <div
        class="pin-window"
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: auto;
          align-items: center;
        "
      >
        <h3>Pin Details</h3>
        <div class="flex input-group">
          <label for="pinInfo.name" class="font-semibold w-24">Name</label>
          <InputText
            size="large"
            v-model="pinInfo.name"
            id="pinInfo.name"
            class="input-text"
            autocomplete="off"
          />
        </div>
        <div class="flex input-group">
          <label for="pinInfo.email" class="font-semibold w-24">Email</label>
          <InputText
            size="large"
            v-model="pinInfo.email"
            id="pinInfo.email"
            class="input-text"
            autocomplete="off"
          />
        </div>
        <div class="flex input-group">
          <label for="pinInfo.phone" class="font-semibold w-24">Phone</label>
          <InputText
            size="large"
            v-model="pinInfo.phone"
            id="pinInfo.phone"
            class="input-text"
            autocomplete="off"
          />
        </div>
        <div class="flex input-group">
          <label for="pinInfo.address" class="font-semibold w-24">Address</label>
          <InputText
            v-model="pinInfo.address"
            id="pinInfo.address"
            class="input-text"
            autocomplete="off"
            size="large"
          />
        </div>
        <div class="flex input-group">
          <label for="pinInfo.city" class="font-semibold w-24">City</label>
          <InputText
            v-model="pinInfo.city"
            id="pinInfo.city"
            class="input-text"
            autocomplete="off"
            size="large"
          />
        </div>
        <div class="flex input-group">
          <label for="pinInfo.state" class="font-semibold w-24">State</label>
          <InputText
            v-model="pinInfo.state"
            id="pinInfo.state"
            class="input-text"
            autocomplete="off"
            size="large"
          />
        </div>
        <div class="flex input-group">
          <label for="pinInfo.zip" class="font-semibold w-24">Zip</label>
          <InputText
            v-model="pinInfo.zip"
            id="pinInfo.zip"
            class="input-text"
            autocomplete="off"
            size="large"
          />
        </div>
        <div class="flex input-group">
          <label for="pinInfo.notes" class="font-semibold w-24">Notes</label>
          <InputText
            size="large"
            v-model="pinInfo.notes"
            id="pinInfo.notes"
            class="input-text"
            autocomplete="off"
          />
        </div>
        <div class="button-group">
          <Button
            type="button"
            label="Cancel"
            severity="danger"
            @click="handleClickedClose"
          ></Button>
          <Button type="button" label="Save" @click="handleClickedSave"></Button>
        </div>
      </div>
    </template>
  </Drawer>

  <!-- <Dialog
    v-model:visible="props.dialogueVisible"
    modal
    header="Pin Details"
    :style="{ width: '20rem' }"
  >
    <div class="flex input-group">
      <label for="pinInfo.name" class="font-semibold w-24">Name</label>
      <InputText
        size="small"
        v-model="pinInfo.name"
        id="pinInfo.name"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex input-group">
      <label for="pinInfo.email" class="font-semibold w-24">Email</label>
      <InputText
        size="small"
        v-model="pinInfo.email"
        id="pinInfo.email"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex input-group">
      <label for="pinInfo.phone" class="font-semibold w-24">Phone</label>
      <InputText
        size="small"
        v-model="pinInfo.phone"
        id="pinInfo.phone"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="flex input-group">
      <label for="pinInfo.address" class="font-semibold w-24">Address</label>
      <InputText
        v-model="pinInfo.address"
        id="pinInfo.address"
        class="flex-auto"
        autocomplete="off"
        size="small"
      />
    </div>
    <div class="flex input-group">
      <label for="pinInfo.notes" class="font-semibold w-24">Notes</label>
      <InputText
        size="small"
        v-model="pinInfo.notes"
        id="pinInfo.notes"
        class="flex-auto"
        autocomplete="off"
      />
    </div>
    <div class="button-group">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="handleClickedClose"
      ></Button>
      <Button type="button" label="Save" @click="handleClickedSave"></Button>
    </div>
  </Dialog> -->
</template>
<style lang="css" scoped>
.input-group {
  display: flex;

  padding: 10px;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}
.input-group label {
  width: 30%;
  font-size: large;
}
.input-text {
  width: 70%;
  font-size: large;
}
.button-group {
  padding: 25px;
  display: flex;
  width: 100%;
  justify-content: space-around;
}
</style>
