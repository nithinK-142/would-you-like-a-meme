<script setup lang="ts">
import { useMemeStore } from "@/stores/memeStore";
import { RefreshCwIcon } from "lucide-vue-next";

const memeStore = useMemeStore();
</script>

<template>
  <header>
    <div class="fixed top-0 flex items-center py-4 pl-4 w-full bg-[#212121]">
      <h1 class="text-base font-semibold sm:text-lg md:text-xl">
        Would You like a Meme?
      </h1>
      <button @click="memeStore.fetchMemes" class="ml-4">
        <RefreshCwIcon :class="memeStore.isLoading && 'animate-spin'" />
      </button>
    </div>
  </header>
</template>
