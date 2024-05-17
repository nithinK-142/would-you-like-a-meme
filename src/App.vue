<script setup lang="ts">
import OverlayAll from "./components/OverlayAll.vue";
import Drawer from "./components/Drawer.vue";
import Pop from "./components/Pop.vue";
</script>

<template>
  <main
    class="flex flex-col items-center justify-center h-screen p-6 space-y-6"
  >
    <h1 class="text-2xl font-semibold text-center">PrimeVue v4</h1>
    <Button label="Submit" icon="pi pi-check" iconPos="right" />
    <OverlayAll />
    <Drawer />
    <Pop />
  </main>
</template>
