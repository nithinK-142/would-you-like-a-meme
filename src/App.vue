<script setup lang="ts">
import { useMemeStore } from "@/stores/memeStore";
import { onMounted, onUnmounted } from "vue";
import Navbar from "./components/Navbar.vue";
import Error from "./components/Error.vue";
import Memes from "./components/Memes.vue";

const memeStore = useMemeStore();

const onPopState = () => memeStore.restoreFromUrl();

onMounted(() => {
  memeStore.fetchMemes();
  window.addEventListener("popstate", onPopState);
});

onUnmounted(() => window.removeEventListener("popstate", onPopState));
</script>

<template>
  <main class="h-screen overflow-hidden bg-[#111111] text-white">
    <Navbar />
    <Error v-if="memeStore.error && !memeStore.isLoading" :message="memeStore.error!" />
    <Memes v-else :memes="memeStore.memes" />
  </main>
</template>