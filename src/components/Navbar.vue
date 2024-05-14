<script setup lang="ts">
import { useMemeStore } from "@/stores/memeStore";
import { RefreshCwIcon } from "lucide-vue-next";
import Sidebar from "./Sidebar.vue";

const memeStore = useMemeStore();
</script>

<template>
  <header>
    <div
      class="fixed top-0 flex items-center pt-2 pb-4 pl-1 w-full bg-[#212121]"
    >
      <Sidebar />
      <h1 class="text-base font-semibold sm:text-lg md:text-xl">
        Would You like a Meme?
      </h1>
      <button @click="memeStore.fetchMemes" class="ml-4">
        <RefreshCwIcon :class="memeStore.isLoading && 'animate-spin'" />
      </button>
    </div>
  </header>
</template>
