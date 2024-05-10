<script setup lang="ts">
import { useMemeStore } from "@/stores/memeStore";
import { onMounted } from "vue";
import Navbar from "./Navbar.vue";
import { ArrowBigUp } from "lucide-vue-next";

const memeStore = useMemeStore();

onMounted(() => memeStore.fetchMemes());
</script>

<template>
  <main class="h-screen sm:floating-scrollbar">
    <Navbar />
    <div v-if="memeStore.error" class="p-4 pt-16 text-red-500">
      {{ memeStore.error }}
    </div>
    <div
      v-else
      class="grid grid-cols-1 gap-4 px-4 pb-4 mt-16 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="meme in memeStore.memes"
        :key="meme.postLink"
        class="p-4 rounded-lg shadow-md bg-stone-700/50"
      >
        <div class="flex items-center mb-2">
          <img src="./reddit.svg" class="w-5 h-5 mr-2" />
          <span class="text-sm font-semibold">{{ meme.subreddit }}</span>
        </div>
        <div class="flex space-x-4">
          <div class="flex items-center mb-2">
            <img src="./reddit-user.svg" class="w-5 h-5 mr-2" />
            <span class="text-base">u/{{ meme.author }}</span>
          </div>

          <div class="flex items-center mb-2">
            <ArrowBigUp />
            {{ meme.ups.toLocaleString() }}
          </div>
        </div>
        <h2 class="flex items-center mb-2 text-lg">
          {{ meme.title }}
        </h2>
        <div class="h-[20rem]">
          <img
            :src="meme.url"
            :alt="meme.title"
            class="object-contain w-full h-full mx-auto rounded-md"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<!-- :style="{ backgroundImage: `url(${meme.url})` }" -->
