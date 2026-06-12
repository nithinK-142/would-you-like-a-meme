<script setup lang="ts">
import { useMemeStore, SUBREDDITS } from "@/stores/memeStore";
import { RefreshCwIcon } from "lucide-vue-next";

const memeStore = useMemeStore();
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur border-b border-white/20">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-baseline gap-3">
        <h1 class="text-xl font-bold tracking-tight">🍿 meme feed</h1>
        <span
          v-if="memeStore.count > 0 && !memeStore.isLoading"
          class="text-sm text-white/35 font-mono"
        >{{ memeStore.count }} loaded</span>
      </div>
      <button
        @click="memeStore.fetchMemes()"
        :disabled="memeStore.isLoading"
        class="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-white/8 hover:bg-white/15 disabled:opacity-40 transition-colors font-medium"
      >
        <RefreshCwIcon :size="15" :class="memeStore.isLoading && 'animate-spin'" />
        Refresh
      </button>
    </div>

    <div class="flex overflow-x-auto scrollbar-none px-6 pb-3 gap-2">
      <button
        v-for="sub in SUBREDDITS"
        :key="sub.value"
        @click="memeStore.switchSubreddit(sub.value)"
        :class="[
          'shrink-0 text-sm px-4 py-1.5 rounded-full border font-medium transition-all',
          memeStore.selectedSubreddit === sub.value
            ? 'bg-white text-black border-white'
            : 'text-white/60 border-white/20 hover:border-white/35 hover:text-white',
        ]"
      >
        {{ sub.label }}
      </button>
    </div>
  </header>
</template>