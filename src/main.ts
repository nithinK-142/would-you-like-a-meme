import "./assets/main.css";
import "primeicons/primeicons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";
import Lara from "./presets/aura";
import App from "./App.vue";

const app = createApp(App);

app.use(createPinia());

app.use(PrimeVue, { unstyled: true, pt: Lara, ripple: true });
app.directive("ripple", Ripple);
app.directive("styleclass", StyleClass);

app.mount("#app");
