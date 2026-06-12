<script setup lang="ts">
import { useMemeStore } from "@/stores/memeStore";

defineProps<{ message: string }>();

const memeStore = useMemeStore();
</script>

<template>
  <div class="flex flex-col items-center justify-center pt-40 gap-3 text-center px-4">
    <span class="text-3xl">😵</span>
    <p class="text-white/50 text-sm">{{ message }}</p>
    <button
      @click="memeStore.fetchMemes()"
      class="mt-2 text-xs px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
    >
      Try again
    </button>
  </div>
</template>