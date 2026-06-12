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
    class="flex flex-col items-center justify-center pt-[7rem] px-4 h-[calc(100vh-4rem)]"
  >
    <div class="w-full max-w-lg rounded-2xl bg-white/5 overflow-hidden animate-pulse">
      <div class="p-4 space-y-2">
        <div class="h-3 w-24 bg-white/10 rounded" />
        <div class="h-3 w-48 bg-white/10 rounded" />
      </div>
      <div class="h-80 bg-white/5" />
      <div class="p-4 flex justify-between">
        <div class="h-3 w-20 bg-white/10 rounded" />
        <div class="h-3 w-20 bg-white/10 rounded" />
      </div>
    </div>
  </div>

  <!-- Card viewer -->
  <div
    v-else-if="current"
    class="flex flex-col items-center pt-[7rem] pb-6 px-4 min-h-screen select-none"
  >
    <!-- Progress bar -->
    <div class="w-full max-w-lg mb-3 flex items-center gap-2">
      <div class="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div
          class="h-full bg-white/40 rounded-full transition-all duration-300"
          :style="{ width: progress + '%' }"
        />
      </div>
      <span class="text-xs text-white/30 font-mono tabular-nums shrink-0">
        {{ currentIndex + 1 }} / {{ memes.length
        }}<span v-if="memeStore.isLoadingMore" class="text-white/20"> …</span>
      </span>
    </div>

    <!-- Card -->
    <div
      class="w-full max-w-lg rounded-2xl bg-[#161616] border border-white/8 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
      :style="{
        transform: isDragging
          ? `translateX(${dragDelta * 0.15}px) rotate(${dragDelta * 0.015}deg)`
          : 'none',
        transition: isDragging ? 'none' : 'transform 0.2s ease',
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
      <div class="flex items-start justify-between px-4 pt-4 pb-3">
        <div class="min-w-0">
          <a
            :href="'https://www.reddit.com/r/' + current.subreddit"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-semibold text-white/60 hover:text-white transition-colors"
            @click.stop
          >r/{{ current.subreddit }}</a>
          <p class="text-xs text-white/30 mt-0.5">u/{{ current.author }}</p>
        </div>
        <div class="flex items-center gap-1 text-xs text-white/40 shrink-0">
          <ArrowBigUp :size="14" class="text-orange-400" />
          <span class="font-mono">{{ formatUps(current.ups) }}</span>
        </div>
      </div>

      <!-- Title -->
      <p
        v-if="current.title && current.title.toLowerCase() !== current.subreddit.toLowerCase()"
        class="px-4 pb-3 text-sm text-white/85 leading-snug"
      >{{ current.title }}</p>

      <!-- Image area with hover arrows -->
      <div class="relative bg-black/40 min-h-48 group/card">

        <!-- NSFW overlay -->
        <div
          v-if="isNsfw && !revealed"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 cursor-pointer"
          @click.stop="revealed = true"
        >
          <div class="absolute inset-0 backdrop-blur-2xl bg-black/60" />
          <EyeOff :size="28" class="relative text-white/40" />
          <span class="relative text-xs text-white/50">
            {{ current.nsfw ? "NSFW" : "Spoiler" }} — tap to reveal
          </span>
        </div>

        <!-- Image -->
        <div
          :class="revealed || !isNsfw ? 'cursor-zoom-in' : ''"
          @click.stop="openLightbox"
        >
          <img
            :key="current.url"
            :src="current.preview?.length ? current.preview[current.preview.length - 1] : current.url"
            :alt="current.title"
            class="w-full max-h-[28rem] object-contain transition-opacity duration-200"
            :class="[
              imgLoaded ? 'opacity-100' : 'opacity-0',
              isNsfw && !revealed ? 'blur-2xl' : '',
            ]"
            @load="imgLoaded = true"
            @dragstart.prevent
          />
        </div>

        <!-- Left arrow — shown on hover -->
        <button
          v-if="currentIndex > 0"
          @click.stop="prev"
          class="absolute left-0 inset-y-0 w-14 z-20 flex items-center justify-start pl-2
                 opacity-0 group-hover/card:opacity-100 transition-opacity"
        >
          <div class="bg-black/55 hover:bg-black/80 rounded-full p-1.5 transition-colors">
            <ChevronLeft :size="18" class="text-white" />
          </div>
        </button>

        <!-- Right arrow — shown on hover -->
        <button
          v-if="currentIndex < memes.length - 1 || memeStore.isLoadingMore"
          @click.stop="next"
          class="absolute right-0 inset-y-0 w-14 z-20 flex items-center justify-end pr-2
                 opacity-0 group-hover/card:opacity-100 transition-opacity"
        >
          <div class="bg-black/55 hover:bg-black/80 rounded-full p-1.5 transition-colors">
            <ChevronRight :size="18" class="text-white" />
          </div>
        </button>

        <!-- Spinner -->
        <div v-if="!imgLoaded" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>

        <!-- GIF badge -->
        <span
          v-if="isGif"
          class="absolute bottom-2 right-2 text-[10px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded z-20 pointer-events-none"
        >GIF</span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end px-4 py-2.5">
        <a
          :href="current.postLink"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 text-xs text-white/25 hover:text-white/60 transition-colors"
          @click.stop
        >
          <ExternalLink :size="11" />
          Reddit
        </a>
      </div>
    </div>

    <p class="mt-4 text-xs text-white/20">swipe or use ← → keys</p>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <Transition name="lb">
      <div
        v-if="lightbox && current"
        class="fixed inset-0 z-50 bg-black/95 flex flex-col"
        @click.self="lightbox = false"
      >
        <!-- Top bar -->
        <div class="flex items-center justify-between px-4 py-3 shrink-0">
          <div class="min-w-0">
            <p class="text-xs text-white/40 truncate">r/{{ current.subreddit }} · u/{{ current.author }}</p>
            <p class="text-sm text-white/80 mt-0.5 line-clamp-1">{{ current.title }}</p>
          </div>
          <button
            @click="lightbox = false"
            class="ml-4 shrink-0 p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Full image -->
        <div
          class="flex-1 flex items-center justify-center overflow-auto p-4"
          @click.self="lightbox = false"
        >
          <img
            :src="current.url"
            :alt="current.title"
            class="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>

        <!-- Bottom bar -->
        <div class="flex items-center justify-between px-4 py-3 shrink-0">
          <div class="flex items-center gap-1.5 text-xs text-white/40">
            <ArrowBigUp :size="13" class="text-orange-400" />
            {{ formatUps(current.ups) }} upvotes
          </div>
          <a
            :href="current.postLink"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
          >
            <ExternalLink :size="12" />
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