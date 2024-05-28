import "./assets/main.css";
import "primeicons/primeicons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Lara from "./presets/lara";
import App from "./App.vue";

const app = createApp(App);

app.use(createPinia());

app.use(PrimeVue, { unstyled: true, pt: Lara });

app.mount("#app");
