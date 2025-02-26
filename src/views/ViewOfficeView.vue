<script setup lang="ts">
import HeaderBar from '../components/HeaderBar.vue'
import EditTeamForm from '../components/EditTeamForm.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useOfficeStore } from '../stores/officeStore'
import type { Office } from '../types/office'

const office = ref<Office>()
const officeId = ref()
const route = useRoute()
const officeStore = useOfficeStore()

onMounted(async () => {
  officeId.value = route.params.id
  office.value = await officeStore.getSingleOffice(officeId.value)
  console.log('Got Office:', office.value)
})
</script>

<template>
  <HeaderBar title="Edit Team" />

  <div class="scroll-container">
    <EditTeamForm :office="office" />
  </div>
</template>
