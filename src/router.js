import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Main.vue";
import BlogControls from "./components/BlogControls";
import BlogView from "./components/BlogView";

Vue.use(Router);

export default new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", component: Home, name: "home" },
    { path: "/edit/", component: BlogControls, name: "edit" },
    { path: "/view/:id", component: BlogView, name: "blog" }
  ]
});
