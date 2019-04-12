<template>
  <section class="hero is-info is-fullheight">
    <div class="BC--hero-body hero-body" v-if="user !== null">
      <div class="blog-controls-big-wrapper">
        <div class="log-controls">
          <div>
            <a class="button is-dark is-small" v-on:click="logout">Log Out</a>
          </div>
          <div>
            Your Blog URL:
            <span style="color: black;">http://smog.komfi.co/#/view/{{user.slug}}</span>
          </div>
        </div>
        <div class="container" v-if="state === 'new'">
          <input
            class="input is-info"
            type="text"
            placeholder="Blog Title Here"
            v-model="blogTitle"
            maxlength="35"
          >
          <div class="editor-container">
            <div id="editor">
              <h1>Creation Starts Here</h1>
              <p>Tell your fans what you are doing.</p>
              <ul>
                <li>Try</li>
                <li>Adding</li>
                <li>A List!</li>
              </ul>
            </div>
          </div>
          <a class="cancel-button button is-white" v-on:click="state = 'pick'">Cancel</a>
          <a class="create-button button is-white" v-on:click="createBlogPost">Create</a>
        </div>
        <div class="container" v-if="state === 'pick'">
          <p class="edit-message">Edit/View an old blog</p>
          <ul class="blog-items">
            <li class="blog-item" v-for="blog in blogs" :key="blog.id">
              <span class="blog-title">{{blog.title}}</span>
              <div>
                <a class="edit-button button" v-on:click="deleteBlogPost(blog)">
                  <i class="far fa-trash-alt"></i>
                </a>
                <a class="edit-button button" v-on:click="editBlogPost(blog)">
                  <i class="far fa-edit"></i>
                </a>
              </div>
            </li>
          </ul>
          <hr>
          <a class="button is-primary" v-on:click="makeNewBlog">
            <i class="fas fa-plus"></i> Post
          </a>
        </div>
        <div class="container" v-if="state === 'edit'">
          <input
            class="input is-info"
            type="text"
            placeholder="Blog Title Here"
            v-model="blogTitle"
            maxlength="35"
          >
          <div class="editor-container">
            <div id="editor"></div>
          </div>
          <a class="cancel-button button is-white" v-on:click="state = 'pick'">Cancel</a>
          <a class="create-button button is-white" v-on:click="createBlogPost">Update</a>
        </div>
      </div>
    </div>
    <div class="BC--hero-body hero-body" v-else>
      <div class="container">You must be logged in to edit your blogs!</div>
    </div>
  </section>
</template>

<script>
import { setInterval, clearInterval } from "timers";

export default {
  created: async function() {
    await this.$store.dispatch("getUser");
    await this.$store.dispatch("getBlogPosts");
  },
  data: function() {
    return {
      // blogs: [],
      blogTitle: "",
      state: "pick",
      activeBlog: null
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    blogs() {
      return this.$store.state.blogPosts;
    }
  },
  methods: {
    logout: async function() {
      await this.$store.dispatch("logout");
      this.$router.push("/");
    },
    deleteBlogPost: async function(blog) {
      const id = blog._id;
      await this.$store.dispatch("deleteBlogPosts", { id });
      await this.$store.dispatch("getBlogPosts");
    },
    createBlogPost: async function() {
      if (this.blogTitle.length === 0) {
        this.$router.app.$emit("error-message", "Blog titles can't be empty!");
        return;
      }
      if (document.querySelector("#editor").textContent.length === 0) {
        this.$router.app.$emit("error-message", "Your blog can't be empty!");
        return;
      }
      const html = document.querySelector("#editor").innerHTML;
      const userId = this.$route.params.id;
      const title = this.blogTitle;
      const delta = this.quill.getContents();
      let data = {
        userId,
        title,
        delta,
        html
      };
      if (this.activeBlog) {
        data = { ...data, id: this.activeBlog._id };
      }
      this.state === "new"
        ? await this.$store.dispatch("createBlogPost", data)
        : await this.$store.dispatch("editBlogPost", data);
      this.resetState();
      await this.$store.dispatch("getBlogPosts");
      this.state = "pick";
    },
    editBlogPost: function(blog) {
      this.state = "edit";
      this.activeBlog = blog;
      this.blogTitle = this.activeBlog.title;
      this.mountQuillEditor().then(() => {
        this.quill.setContents(this.activeBlog.delta);
      });
    },
    makeNewBlog: function() {
      this.state = "new";
      this.blogTitle = "";
      this.activeBlog = null;
      this.mountQuillEditor();
    },
    mountQuillEditor: function() {
      return new Promise(resolve => {
        const interval = setInterval(() => {
          if (document.querySelector("#editor")) {
            clearInterval(interval);
            this.quill = new window.Quill("#editor", {
              theme: "snow"
            });
            resolve();
          }
        }, 10);
      });
    },
    resetState: function() {
      this.blogTitle = "";
      this.activeBlog = null;
    }
  }
};
</script>

<style scoped>
.log-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
.edit-message {
  font-size: 22px;
  margin-bottom: 10px;
}
.cancel-button {
  margin-top: 10px;
  float: left;
}
.fa-plus {
  margin-right: 10px;
}
.blog-items {
  margin: 0 auto;
  width: 50%;
  min-width: 250px;
}
.blog-item {
  background-color: white;
  border-radius: 15px;
  margin: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.edit-button {
  margin-left: 10px;
  background-color: transparent;
  border: transparent;
  color: black;
  float: right;
}
.blog-title {
  padding-left: 10px;
  font-size: 35px;
  color: black;
  word-break: break-all;
}
.BC--hero-body {
  align-items: flex-start !important;
  text-align: center;
}
.editor-container {
  background-color: white;
  color: black;
}
.create-button {
  margin-top: 10px;
  float: right;
}
input {
  width: 30%;
  min-width: 200px;
  margin-bottom: 10px;
}
.blog-controls-big-wrapper {
  margin: 0 auto;
}
</style>
