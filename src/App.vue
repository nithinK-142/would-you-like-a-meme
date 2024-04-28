<script setup lang="ts">
import { useMemeStore } from "@/stores/memeStore";
import { onMounted } from "vue";

const memeStore = useMemeStore();

onMounted(() => {
  memeStore.fetchMemes();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-semibold mb-6">Would You like a Meme?</h1>

    <div v-if="memeStore.isLoading">Loading...</div>
    <div v-else-if="memeStore.error" class="text-red-500">
      {{ memeStore.error }}
    </div>
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="meme in memeStore.memes"
        :key="meme.postLink"
        class="bg-stone-700/50 rounded-lg shadow-md p-4"
      >
        <h2 class="text-lg font-bold mb-2">{{ meme.title }}</h2>
        <p class="mb-1">Subreddit: {{ meme.subreddit }}</p>
        <p class="mb-1">Author: {{ meme.author }}</p>
        <p class="mb-2">Upvotes: {{ meme.ups }}</p>
        <img
          :src="meme.url"
          :alt="meme.title"
          class="w-full h-auto rounded-md"
        />
      </div>
    </div>
  </div>
</template>
