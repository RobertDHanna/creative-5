import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    blogPosts: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setBlogPosts(state, blogPosts) {
      state.blogPosts = blogPosts;
    }
  },
  actions: {
    async register(context, data) {
      try {
        let response = await axios.post("/api/users", data);
        context.commit("setUser", response.data);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async login(context, data) {
      try {
        let response = await axios.post("/api/users/login", data);
        context.commit("setUser", response.data);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async logout(context) {
      try {
        await axios.delete("/api/users");
        context.commit("setUser", null);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async getUser(context) {
      try {
        let response = await axios.get("/api/users");
        context.commit("setUser", response.data);
        return "";
      } catch (error) {
        return "";
      }
    },
    async getBlogsBySlug(context, data) {
      try {
        const response = await axios.get(`/api/blogs/${data.slug}`);
        context.commit(
          "setBlogPosts",
          response.data.slice().sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
        );
      } catch (error) {
        return "";
      }
    },
    async getBlogPosts(context) {
      try {
        let response = await axios.get("/api/blogs");
        context.commit(
          "setBlogPosts",
          response.data.slice().sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
        );
        return "";
      } catch (error) {
        return "";
      }
    },
    async deleteBlogPosts(context, data) {
      try {
        await axios.delete(`/api/blogs/${data.id}`);
        return "";
      } catch (error) {
        return "";
      }
    },
    async createBlogPost(context, data) {
      try {
        await axios.post("/api/blogs", data);
        return "";
      } catch (error) {
        return "";
      }
    },
    async editBlogPost(context, data) {
      try {
        await axios.put("/api/blogs", data);
        return "";
      } catch (error) {
        return "";
      }
    }
  }
});
