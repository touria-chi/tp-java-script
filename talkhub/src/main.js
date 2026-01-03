import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import BootstrapVue3 from "bootstrap-vue-3";

import "./firebase";

import { getAuth, onAuthStateChanged } from "firebase/auth";

let app;

const auth = getAuth();

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.use(BootstrapVue3);
    app.mount("#app");
  }
});
