<script setup lang="ts">
import { useMemeStore, SUBREDDITS } from "@/stores/memeStore";
import { RefreshCwIcon } from "lucide-vue-next";

const memeStore = useMemeStore();
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d] border-b border-white/10">
    <!-- Top bar -->
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <h1 class="text-base font-semibold tracking-tight">
          🍿 meme feed
        </h1>
        <span
          v-if="memeStore.count > 0 && !memeStore.isLoading"
          class="text-xs text-white/40 font-mono tabular-nums"
        >
          {{ memeStore.count }} loaded
        </span>
      </div>
      <button
        @click="memeStore.fetchMemes()"
        :disabled="memeStore.isLoading"
        class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 transition-colors"
      >
        <RefreshCwIcon
          :size="13"
          :class="memeStore.isLoading && 'animate-spin'"
        />
        Refresh
      </button>
    </div>

    <!-- Subreddit tabs -->
    <div class="flex overflow-x-auto scrollbar-none px-4 pb-2 gap-2">
      <button
        v-for="sub in SUBREDDITS"
        :key="sub.value"
        @click="memeStore.switchSubreddit(sub.value)"
        :class="[
          'shrink-0 text-xs px-3 py-1 rounded-full border transition-all',
          memeStore.selectedSubreddit === sub.value
            ? 'bg-white text-black border-white font-semibold'
            : 'text-white/50 border-white/15 hover:border-white/40 hover:text-white/80',
        ]"
      >
        {{ sub.label }}
      </button>
    </div>
  </header>
</template>