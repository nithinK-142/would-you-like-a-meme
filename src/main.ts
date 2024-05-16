import "./style.css";
import "primeicons/primeicons.css";
import { createApp } from "vue";
import PrimeVueUnstyled from "primevue/config";
import Aura from "@/presets";
import App from "./App.vue";
import Button from "primevue/button";
import Sidebar from "primevue/sidebar";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";

const app = createApp(App);

app.use(PrimeVueUnstyled, { unstyled: true, pt: Aura });

app.directive("ripple", Ripple);
app.directive("styleclass", StyleClass);

app.component("Button", Button);
app.component("Sidebar", Sidebar);

app.mount("#app");
