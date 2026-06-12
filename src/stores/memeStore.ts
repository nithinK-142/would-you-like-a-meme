import { ref, computed } from "vue";
import { defineStore } from "pinia";

export interface Meme {
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

export const SUBREDDITS = [
  { label: "r/memes", value: "memes" },
  { label: "r/dankmemes", value: "dankmemes" },
  { label: "r/me_irl", value: "me_irl" },
  { label: "r/ProgrammerHumor", value: "ProgrammerHumor" },
  { label: "r/technicallythetruth", value: "technicallythetruth" },
  { label: "r/shitposting", value: "shitposting" },
];

export const useMemeStore = defineStore("memeStore", () => {
  const memes = ref<Meme[]>([]);
  const isLoading = ref<boolean>(false);
  const isLoadingMore = ref<boolean>(false);
  const error = ref<string | null>(null);
  const selectedSubreddit = ref<string>("memes");
  const seenUrls = ref<Set<string>>(new Set());
  const count = ref<number>(0);

  const hasNsfw = computed(() => memes.value.some((m) => m.nsfw || m.spoiler));

  const buildUrl = (subreddit: string, n = 12) =>
    `https://meme-api.com/gimme/${subreddit}/${n}`;

  const dedupMemes = (incoming: Meme[]): Meme[] => {
    return incoming.filter((m) => {
      if (seenUrls.value.has(m.url)) return false;
      seenUrls.value.add(m.url);
      return true;
    });
  };

  const fetchMemes = async (subreddit = selectedSubreddit.value) => {
    isLoading.value = true;
    error.value = null;
    seenUrls.value.clear();
    count.value = 0;

    try {
      // Fetch extra to account for dedup losses
      const response = await fetch(buildUrl(subreddit, 18));
      if (!response.ok) throw new Error(`Failed to fetch (${response.status})`);
      const data = await response.json();
      const fresh = dedupMemes(data.memes ?? []);
      memes.value = fresh;
      count.value = fresh.length;
    } catch (err: any) {
      error.value = err.message ?? "Something went wrong";
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = async () => {
    if (isLoadingMore.value) return;
    isLoadingMore.value = true;

    try {
      const response = await fetch(buildUrl(selectedSubreddit.value, 18));
      if (!response.ok) throw new Error(`Failed to fetch (${response.status})`);
      const data = await response.json();
      const fresh = dedupMemes(data.memes ?? []);
      memes.value.push(...fresh);
      count.value += fresh.length;
    } catch (err: any) {
      error.value = err.message ?? "Something went wrong";
    } finally {
      isLoadingMore.value = false;
    }
  };

  const switchSubreddit = (subreddit: string) => {
    selectedSubreddit.value = subreddit;
    fetchMemes(subreddit);
  };

  return {
    memes,
    isLoading,
    isLoadingMore,
    error,
    selectedSubreddit,
    count,
    hasNsfw,
    fetchMemes,
    loadMore,
    switchSubreddit,
  };
});