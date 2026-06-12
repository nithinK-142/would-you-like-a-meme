<script setup lang="ts">
import { useMemeStore } from "@/stores/memeStore";
import { onMounted } from "vue";
import Navbar from "./components/Navbar.vue";
import Error from "./components/Error.vue";
import Memes from "./components/Memes.vue";

const memeStore = useMemeStore();

onMounted(() => memeStore.fetchMemes());
</script>

<template>
  <main class="min-h-screen bg-[#0d0d0d] text-white">
    <Navbar />
    <Error v-if="memeStore.error && !memeStore.isLoading" :message="memeStore.error!" />
    <Memes v-else :memes="memeStore.memes" />
  </main>
</template>