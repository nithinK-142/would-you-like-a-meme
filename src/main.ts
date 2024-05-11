import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";

// @ts-ignore
import Lara from "./presets/lara";
import App from "./App.vue";

const app = createApp(App);

app.use(createPinia());

app.use(PrimeVue, { unstyled: true, pt: Lara });

app.mount("#app");
