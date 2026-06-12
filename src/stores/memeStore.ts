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
  { label: "All", value: "all" },
  { label: "r/memes", value: "memes" },
  { label: "r/dankmemes", value: "dankmemes" },
  { label: "r/me_irl", value: "me_irl" },
  { label: "r/ProgrammerHumor", value: "ProgrammerHumor" },
  { label: "r/technicallythetruth", value: "technicallythetruth" },
  { label: "r/shitposting", value: "shitposting" },
];

const VALID_SUBREDDITS = new Set(SUBREDDITS.map((s) => s.value));
const LS_KEY = "meme-feed:subreddit";

export const resolveInitialSubreddit = (): string => {
  const fromUrl = new URLSearchParams(window.location.search).get("r");
  if (fromUrl && VALID_SUBREDDITS.has(fromUrl)) return fromUrl;
  return "all";
};

export const useMemeStore = defineStore("memeStore", () => {
  const memes = ref<Meme[]>([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const error = ref<string | null>(null);
  const selectedSubreddit = ref<string>(resolveInitialSubreddit());
  const seenUrls = ref<Set<string>>(new Set());
  const count = ref(0);

  const hasNsfw = computed(() => memes.value.some((m) => m.nsfw || m.spoiler));

  const buildUrl = (subreddit: string, n = 18) =>
    `https://meme-api.com/gimme/${subreddit}/${n}`;

  const dedupMemes = (incoming: Meme[]): Meme[] =>
    incoming.filter((m) => {
      if (seenUrls.value.has(m.url)) return false;
      seenUrls.value.add(m.url);
      return true;
    });

  const pushHistory = (subreddit: string) => {
    const url = new URL(window.location.href);
    if (subreddit === "all") {
      url.searchParams.delete("r");
    } else {
      url.searchParams.set("r", subreddit);
    }
    window.history.pushState({ subreddit }, "", url.toString());
  };

  const fetchMemes = async () => {
    isLoading.value = true;
    error.value = null;
    memes.value = [];
    seenUrls.value.clear();
    count.value = 0;

    try {
      const response = await fetch(buildUrl(selectedSubreddit.value));
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
      const response = await fetch(buildUrl(selectedSubreddit.value));
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
    if (!VALID_SUBREDDITS.has(subreddit)) return;
    selectedSubreddit.value = subreddit;
    localStorage.setItem(LS_KEY, subreddit);
    pushHistory(subreddit);
    fetchMemes();
  };

  const restoreFromUrl = () => {
    const fromUrl = new URLSearchParams(window.location.search).get("r");
    const sub = fromUrl && VALID_SUBREDDITS.has(fromUrl) ? fromUrl : "all";
    selectedSubreddit.value = sub;
    localStorage.setItem(LS_KEY, sub);
    fetchMemes();
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
    restoreFromUrl,
  };
});