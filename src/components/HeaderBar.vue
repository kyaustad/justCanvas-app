<script setup lang="ts">
import BackButton from './BackButton.vue'

const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="header-container" v-motion-slide-top>
    <div class="header-bar">
      <h1 class="title-text" style="color: black">{{ props.title }}</h1>
    </div>
  </div>
  <BackButton style="max-height: 40px" />
</template>

<style lang="css" scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  text-justify: center;
  width: 100%;

  background-color: #34d399;
  /* background: linear-gradient(to bottom, #34d399, #468c78); */
  box-shadow: 0 10px 8px #181818ab;
}
.header-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

@media (max-width: 805px) {
  .title-text {
    margin-top: 70px;
  }
}
</style>
