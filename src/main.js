import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import GlobalAlert from "./components/ui/GlobalAlert.vue";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.component("GlobalAlert", GlobalAlert);
app.mount("#app");
