<script setup lang="ts">
import { ref } from "vue";
import { useMemeStore, SUBREDDITS } from "@/stores/memeStore";
import { RefreshCwIcon, Menu, X } from "lucide-vue-next";

const memeStore = useMemeStore();
const sidebarOpen = ref(false);

const select = (value: string) => {
  memeStore.switchSubreddit(value);
  sidebarOpen.value = false;
};
</script>

<template>
  <!-- Navbar -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur border-b border-white/10">
    <div class="flex items-center justify-between px-4 py-2">
      <div class="flex items-center gap-3">
        <button
          @click="sidebarOpen = true"
          class="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          <Menu :size="20" />
        </button>
        <div class="flex items-baseline gap-2.5">
          <h1 class="text-xl font-bold tracking-tight">🍿 meme feed</h1>
          <span
            v-if="memeStore.count > 0 && !memeStore.isLoading"
            class="text-sm text-white/35 font-mono"
          >{{ memeStore.count }} loaded</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-white/50 font-medium">
          {{ SUBREDDITS.find(s => s.value === memeStore.selectedSubreddit)?.label }}
        </span>
        <button
          @click="memeStore.fetchMemes()"
          :disabled="memeStore.isLoading"
          class="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-white/8 hover:bg-white/15 disabled:opacity-40 transition-colors font-medium"
        >
          <RefreshCwIcon :size="15" :class="memeStore.isLoading && 'animate-spin'" />
          Refresh
        </button>
      </div>
    </div>
  </header>

  <!-- Sidebar overlay -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        @click="sidebarOpen = false"
      />
    </Transition>

    <Transition name="slide">
      <div
        v-if="sidebarOpen"
        class="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#1e1e1e] border-r border-white/10 flex flex-col"
      >
        <!-- Sidebar header -->
        <div class="flex items-center justify-between px-5 py-5 border-b border-white/8">
          <h2 class="text-base font-semibold text-white/80">Browse</h2>
          <button
            @click="sidebarOpen = false"
            class="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Subreddit list -->
        <nav class="flex-1 overflow-y-auto py-3">
          <button
            v-for="sub in SUBREDDITS"
            :key="sub.value"
            @click="select(sub.value)"
            :class="[
              'w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors',
              memeStore.selectedSubreddit === sub.value
                ? 'bg-white/10 text-white'
                : 'text-white/55 hover:bg-white/6 hover:text-white/90',
            ]"
          >
            <span class="text-sm font-medium">{{ sub.label }}</span>
            <span
              v-if="memeStore.selectedSubreddit === sub.value"
              class="w-1.5 h-1.5 rounded-full bg-white"
            />
          </button>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>