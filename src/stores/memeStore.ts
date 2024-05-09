import { ref } from "vue";
import { defineStore } from "pinia";

interface Meme {
  postLink: string;
  subreddit: string;
  title: string;
  url: string;
  nsfw: boolean;
  spoiler: boolean;
  author: string;
  ups: number;
  preview: string[];
}

export const useMemeStore = defineStore("memeStore", () => {
  const MEME_API_URL = "https://meme-api.com/gimme/9";
  const memes = ref<Meme[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchMemes = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(MEME_API_URL);
      const data = await response.json();
      memes.value = data.memes;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  return { memes, isLoading, error, fetchMemes };
});
