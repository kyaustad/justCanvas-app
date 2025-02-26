<script setup lang="ts">
import HeaderBar from '../components/HeaderBar.vue'
import BottomBar from '../components/BottomBar.vue'
import AddTeamForm from '../components/AddTeamForm.vue'
</script>

<template>
  <HeaderBar title="Add Team" />

  <div class="scroll-container">
    <AddTeamForm></AddTeamForm>
  </div>
</template>
