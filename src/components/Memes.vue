<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { ArrowBigUp, ExternalLink, EyeOff, ChevronLeft, ChevronRight, X } from "lucide-vue-next";
import type { Meme } from "@/stores/memeStore";
import { useMemeStore } from "@/stores/memeStore";

const props = defineProps<{ memes: Meme[] }>();
const memeStore = useMemeStore();

const currentIndex = ref(0);
const revealed = ref(false);
const imgLoaded = ref(false);
const lightbox = ref(false);

const dragStartX = ref<number | null>(null);
const dragDelta = ref(0);
const isDragging = ref(false);

const current = computed(() => props.memes[currentIndex.value] ?? null);
const isNsfw = computed(() => !!(current.value?.nsfw || current.value?.spoiler));
const isGif = computed(() => current.value?.url.endsWith(".gif") ?? false);
const progress = computed(() =>
  props.memes.length ? ((currentIndex.value + 1) / props.memes.length) * 100 : 0
);

const formatUps = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const goTo = (index: number) => {
  if (index < 0 || index >= props.memes.length) return;
  currentIndex.value = index;
  revealed.value = false;
  imgLoaded.value = false;
  lightbox.value = false;
  if (index >= props.memes.length - 3 && !memeStore.isLoadingMore) {
    memeStore.loadMore();
  }
};

const prev = () => goTo(currentIndex.value - 1);
const next = () => goTo(currentIndex.value + 1);

const openLightbox = () => {
  if (isNsfw.value && !revealed.value) return;
  lightbox.value = true;
};

const onKeyDown = (e: KeyboardEvent) => {
  if (lightbox.value) {
    if (e.key === "Escape") lightbox.value = false;
    return;
  }
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
};
onMounted(() => window.addEventListener("keydown", onKeyDown));
onUnmounted(() => window.removeEventListener("keydown", onKeyDown));

const onDragStart = (e: MouseEvent | TouchEvent) => {
  dragStartX.value = "touches" in e ? e.touches[0].clientX : e.clientX;
  isDragging.value = false;
  dragDelta.value = 0;
};
const onDragMove = (e: MouseEvent | TouchEvent) => {
  if (dragStartX.value === null) return;
  const x = "touches" in e ? e.touches[0].clientX : e.clientX;
  dragDelta.value = x - dragStartX.value;
  if (Math.abs(dragDelta.value) > 5) isDragging.value = true;
};
const onDragEnd = () => {
  if (Math.abs(dragDelta.value) > 60) {
    dragDelta.value < 0 ? next() : prev();
  }
  dragStartX.value = null;
  dragDelta.value = 0;
  isDragging.value = false;
};

watch(() => props.memes, (newMemes, oldMemes) => {
  if (newMemes[0]?.url !== oldMemes?.[0]?.url) {
    currentIndex.value = 0;
    revealed.value = false;
    imgLoaded.value = false;
    lightbox.value = false;
  }
});
</script>

<template>
  <!-- Skeleton -->
  <div
    v-if="memeStore.isLoading"
    class="flex items-center justify-center px-4" style="height: 100vh; padding-top: 73px; box-sizing: border-box;"
  >
    <div class="w-full max-w-2xl rounded-3xl bg-white/5 overflow-hidden animate-pulse">
      <div class="p-6 space-y-3">
        <div class="h-4 w-32 bg-white/10 rounded-full" />
        <div class="h-4 w-56 bg-white/8 rounded-full" />
        <div class="h-5 w-80 bg-white/10 rounded-full mt-4" />
      </div>
      <div class="h-96 bg-white/5" />
      <div class="p-5 flex justify-end">
        <div class="h-4 w-24 bg-white/8 rounded-full" />
      </div>
    </div>
  </div>

  <!-- Card viewer -->
  <div
    v-else-if="current"
    class="flex flex-col items-center justify-center px-4 select-none gap-3" style="height: 100vh; padding-top: 73px; box-sizing: border-box;"
  >
    <!-- Progress -->
    <div class="w-full max-w-2xl flex items-center gap-3">
      <div class="flex-1 h-1 bg-white/12 rounded-full overflow-hidden">
        <div
          class="h-full bg-white/50 rounded-full transition-all duration-300"
          :style="{ width: progress + '%' }"
        />
      </div>
      <span class="text-sm text-white/40 font-mono tabular-nums shrink-0">
        {{ currentIndex + 1 }}<span class="text-white/20"> / {{ memes.length }}</span>
        <span v-if="memeStore.isLoadingMore" class="text-white/20"> …</span>
      </span>
    </div>

    <!-- Card -->
    <div
      class="w-full max-w-2xl rounded-3xl bg-[#242424] border border-white/12 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing flex flex-col" style="max-height: calc(100vh - 9rem)"
      :style="{
        transform: isDragging
          ? `translateX(${dragDelta * 0.12}px) rotate(${dragDelta * 0.012}deg)`
          : 'none',
        transition: isDragging ? 'none' : 'transform 0.25s ease',
      }"
      @mousedown="onDragStart"
      @mousemove="onDragMove"
      @mouseup="onDragEnd"
      @mouseleave="onDragEnd"
      @touchstart.passive="onDragStart"
      @touchmove.passive="onDragMove"
      @touchend="onDragEnd"
    >
      <!-- Header -->
      <div class="flex items-start justify-between px-6 pt-5 pb-4">
        <div class="min-w-0">
          <a
            :href="'https://www.reddit.com/r/' + current.subreddit"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-bold text-white/70 hover:text-white transition-colors"
            @click.stop
          >r/{{ current.subreddit }}</a>
          <p class="text-sm text-white/40 mt-1">u/{{ current.author }}</p>
        </div>
        <div class="flex items-center gap-1.5 shrink-0 mt-0.5">
          <ArrowBigUp :size="18" class="text-orange-400" />
          <span class="text-base font-semibold text-white/70 font-mono">{{ formatUps(current.ups) }}</span>
        </div>
      </div>

      <!-- Title -->
      <p
        v-if="current.title && current.title.toLowerCase() !== current.subreddit.toLowerCase()"
        class="px-6 pb-4 text-base text-white/90 leading-snug font-medium"
      >{{ current.title }}</p>

      <!-- Image area -->
      <div class="relative bg-black/40 group/card flex-1 min-h-0">
        <!-- NSFW overlay -->
        <div
          v-if="isNsfw && !revealed"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 cursor-pointer"
          @click.stop="revealed = true"
        >
          <div class="absolute inset-0 backdrop-blur-2xl bg-black/70" />
          <EyeOff :size="36" class="relative text-white/40" />
          <span class="relative text-sm font-medium text-white/50">
            {{ current.nsfw ? "NSFW" : "Spoiler" }} — tap to reveal
          </span>
        </div>

        <!-- Image -->
        <div
          :class="revealed || !isNsfw ? 'cursor-zoom-in' : ''"
          class="h-full"
          @click.stop="openLightbox"
        >
          <img
            :key="current.url"
            :src="current.preview?.length ? current.preview[current.preview.length - 1] : current.url"
            :alt="current.title"
            class="w-full h-full object-contain transition-opacity duration-200"
            :class="[
              imgLoaded ? 'opacity-100' : 'opacity-0',
              isNsfw && !revealed ? 'blur-2xl' : '',
            ]"
            @load="imgLoaded = true"
            @dragstart.prevent
          />
        </div>

        <!-- Left arrow -->
        <button
          @click.stop="prev"
          :disabled="currentIndex === 0"
          class="absolute left-0 inset-y-0 w-16 z-20 flex items-center justify-start pl-3
                 opacity-0 group-hover/card:opacity-100 transition-opacity"
        >
          <div class="bg-black/60 rounded-full p-2 transition-colors"
               :class="currentIndex === 0 ? 'opacity-30' : 'hover:bg-black/85'"
          >
            <ChevronLeft :size="22" class="text-white" />
          </div>
        </button>

        <!-- Right arrow -->
        <button
          @click.stop="next"
          :disabled="currentIndex >= memes.length - 1 && !memeStore.isLoadingMore"
          class="absolute right-0 inset-y-0 w-16 z-20 flex items-center justify-end pr-3 opacity-0 group-hover/card:opacity-100 transition-opacity"
        >
          <div class="bg-black/60 rounded-full p-2 transition-colors"
               :class="currentIndex >= memes.length - 1 && !memeStore.isLoadingMore ? 'opacity-30' : 'hover:bg-black/85'"
          >
            <ChevronRight :size="22" class="text-white" />
          </div>
        </button>

        <!-- Spinner -->
        <div v-if="!imgLoaded" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="w-8 h-8 border-2 border-white/15 border-t-white/50 rounded-full animate-spin" />
        </div>

        <!-- GIF badge -->
        <span
          v-if="isGif"
          class="absolute bottom-3 right-3 text-xs font-bold bg-black/70 text-white px-2 py-1 rounded-md z-20 pointer-events-none tracking-wider"
        >GIF</span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end px-6 py-4">
        <a
          :href="current.postLink"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/70 transition-colors"
          @click.stop
        >
          <ExternalLink :size="14" />
          Open on Reddit
        </a>
      </div>
    </div>

    <p class="text-sm text-white/20 tracking-wide">swipe or use ← → keys</p>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <Transition name="lb">
      <div
        v-if="lightbox && current"
        class="fixed inset-0 z-50 flex flex-col"
        @click.self="lightbox = false"
      >
        <div class="absolute inset-0 bg-black/80 backdrop-blur-2xl" @click="lightbox = false" />
        <div class="relative z-10 flex items-center justify-between px-6 py-4 shrink-0">
          <div class="min-w-0">
            <p class="text-sm text-white/40 truncate">r/{{ current.subreddit }} · u/{{ current.author }}</p>
            <p class="text-base font-medium text-white/85 mt-1 line-clamp-2 leading-snug">{{ current.title }}</p>
          </div>
          <button
            @click="lightbox = false"
            class="ml-6 shrink-0 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X :size="22" />
          </button>
        </div>

        <div
          class="relative z-10 flex-1 flex items-center justify-center overflow-auto p-6"
          @click.self="lightbox = false"
        >
          <img
            :src="current.url"
            :alt="current.title"
            class="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>

        <div class="relative z-10 flex items-center justify-between px-6 py-4 shrink-0">
          <div class="flex items-center gap-2 text-sm text-white/50">
            <ArrowBigUp :size="16" class="text-orange-400" />
            {{ formatUps(current.ups) }} upvotes
          </div>
          <a
            :href="current.postLink"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ExternalLink :size="14" />
            Open on Reddit
          </a>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.15s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}
</style>