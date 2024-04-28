<script setup lang="ts">
import { useMemeStore } from "@/stores/memeStore";
import { onMounted } from "vue";
import {
  BookmarkIcon,
  UserIcon,
  HandThumbUpIcon,
  TvIcon,
} from "@heroicons/vue/24/solid";

const memeStore = useMemeStore();

onMounted(() => {
  memeStore.fetchMemes();
});
</script>

<template>
  <div class="container px-4 py-8 mx-auto">
    <h1 class="mb-6 text-3xl font-semibold">Would You like a Meme?</h1>

    <div v-if="memeStore.isLoading">Loading...</div>
    <div v-else-if="memeStore.error" class="text-red-500">
      {{ memeStore.error }}
    </div>
    <div
      v-else
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <div
        v-for="meme in memeStore.memes"
        :key="meme.postLink"
        class="p-4 h-[30rem] rounded-lg shadow-md bg-stone-700/50"
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

        <img
          :src="meme.url"
          :alt="meme.title"
          class="w-full h-auto rounded-md"
        />
      </div>
    </div>
  </div>
</template>
