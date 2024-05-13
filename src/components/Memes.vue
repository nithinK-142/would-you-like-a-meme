<script setup lang="ts">
import { ArrowBigUp } from "lucide-vue-next";
import reddit from "@/assets/reddit.svg";
import redditUser from "@/assets/reddit-user.svg";
import type { Meme } from "@/stores/memeStore";
import Card from "primevue/card";

defineProps<{ memes: Meme[] }>();
</script>
<template>
  <div
    class="grid grid-cols-1 gap-4 px-4 mt-16 mb-4 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4"
  >
    <Card
      class="p-4 bg-stone-700/50"
      v-for="meme in memes"
      :key="meme.postLink"
    >
      <template #header>
        <div class="flex items-center mb-1">
          <img :src="reddit" class="w-5 h-5 mr-2" />
          <a
            :href="'https://www.reddit.com/r/' + meme.subreddit"
            target="_blank"
            class="text-sm font-semibold"
          >
            {{ meme.subreddit }}
          </a>
        </div>
        <div class="flex space-x-4">
          <div class="flex items-center">
            <img :src="redditUser" class="w-5 h-5 mr-2" />
            <span class="text-base">u/{{ meme.author }}</span>
          </div>

          <div class="flex items-center">
            <ArrowBigUp />
            {{ meme.ups.toLocaleString() }}
          </div>
        </div>
      </template>

      <template #title>
        <h2
          v-if="
            meme.subreddit.toLocaleLowerCase() !==
            meme.title.toLocaleLowerCase()
          "
          class="mb-0 text-base font-normal"
        >
          {{ meme.title }}
        </h2>
      </template>

      <template #content>
        <div class="h-[20rem]">
          <a :href="meme.url" target="_blank">
            <img
              :src="meme.url"
              :alt="meme.title"
              class="object-contain w-full h-full mx-auto rounded-md"
            />
          </a>
        </div>
      </template>
    </Card>
  </div>
</template>
