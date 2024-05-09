<script setup lang="ts">
import { useMemeStore } from "@/stores/memeStore";
import { onMounted } from "vue";
import {
  BookmarkIcon,
  UserIcon,
  HandThumbUpIcon,
  TvIcon,
} from "@heroicons/vue/24/solid";
import Navbar from "./Navbar.vue";

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
        <h2 class="flex items-center mb-2 text-lg font-bold">
          <BookmarkIcon class="w-5 h-5 mr-2 text-gray-400" />
          {{ meme.title }}
        </h2>
        <div class="flex items-center mb-2">
          <TvIcon class="w-4 h-4 mr-2 text-gray-400" />
          {{ meme.subreddit }}
        </div>
        <div class="flex items-center mb-2">
          <UserIcon class="w-4 h-4 mr-2 text-gray-400" />
          {{ meme.author }}
        </div>
        <div class="flex items-center mb-2">
          <HandThumbUpIcon class="w-4 h-4 mr-2 text-gray-400" />
          {{ meme.ups }} Upvotes
        </div>
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
./Header.vue
