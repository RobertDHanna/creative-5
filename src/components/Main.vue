<template>
  <section class="hero is-info is-fullheight">
    <div class="Main--container hero-body">
      <div class="container">
        <h1 class="title">Smog</h1>
        <h2 class="subtitle">
          <i>Small Blogs For Busy People</i>
        </h2>
        <level/>
        <div v-if="state === 'login'">
          <label class="label">Username</label>
          <input class="input" type="text" placeholder="e.g JonSnow" v-model="username">
          <label class="label">Password</label>
          <input class="input" type="password" placeholder="e.g hunter12" v-model="password">
          <br>
          <a class="button is-dark" v-on:click="login">Login</a>
        </div>
        <div v-if="state === 'login-option'" class="login-option">
          <a class="button is-dark" v-on:click="state = 'login'">Login</a>
          <div>or</div>
          <a class="button is-dark" v-on:click="state = 'register'">Register</a>
        </div>
        <div v-if="state === 'register'">
          <label class="label">Username</label>
          <input class="input" type="text" placeholder="e.g JonSnow" v-model="username">
          <label class="label">Password</label>
          <input class="input" type="password" placeholder="e.g hunter12" v-model="password">
          <br>
          <label class="label">Blog Name</label>
          <input
            class="input"
            type="text"
            placeholder="What should your blog be called?"
            v-model="previewLink"
            maxlength="75"
          >
          <br>
          <a class="button is-dark" v-on:click="register">Register</a>
          <br>
          <p>http://smog.komfi.co/#/view/{{blogSlug}}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Level from "./Level.vue";
export default {
  data: function() {
    return {
      state: "login-option",
      previewLink: "",
      baseUrl: "http://smog.komfi.co/",
      username: "",
      password: ""
    };
  },
  async created() {
    await this.$store.dispatch("getUser");
    if (this.$store.state.user) {
      this.$router.push("edit");
    }
  },
  methods: {
    login: async function() {
      try {
        this.error = await this.$store.dispatch("login", {
          username: this.username,
          password: this.password
        });
        if (this.error === "") {
          this.$router.push("edit");
        } else {
          this.$router.app.$emit(
            "error-message",
            "Couldn't log in. Is your password correct?"
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    register: async function() {
      if (
        this.blogSlug.length > 0 &&
        this.username.length > 0 &&
        this.password.length > 0
      ) {
        try {
          this.error = await this.$store.dispatch("register", {
            name: this.username,
            username: this.username,
            password: this.password,
            slug: this.blogSlug
          });
          if (this.error === "") {
            this.$router.push("edit");
          } else {
            console.log(this.error);
            this.$router.app.$emit("error-message", this.error);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        this.$router.app.$emit("error-message", "All fields are required!");
      }
    },
    createBlog: async function() {
      if (this.blogSlug.length > 0) {
        const result = await fetch(`/api/users`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            slug: this.blogSlug
          })
        }).then(r => r.json());
        if (result.error) {
          this.$router.app.$emit(
            "error-message",
            "Yikes, something bad happened."
          );
        } else {
          this.userSlug = result.slug;
          this.customId = result.customId;
        }
      } else {
        this.$router.app.$emit("error-message", "Blog names can't be empty!");
      }
    }
  },
  computed: {
    blogSlug: function() {
      const slug = this.previewLink
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      return slug[slug.length - 1] === "-"
        ? slug.slice(0, slug.length - 1)
        : slug;
    }
  },
  components: { Level }
};
</script>


<style scoped>
.label {
  color: white;
}
.Main--container {
  align-items: flex-start !important;
  text-align: center;
}

.title {
  font-size: 112px;
}

input {
  width: 50%;
  min-width: 300px;
  margin-bottom: 15px;
}
.login-option {
  display: flex;
  justify-content: space-between;
  width: 200px;
  margin: 0 auto;
}
.button {
  /* margin-left: 15px; */
}

.input-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input-container p {
  font-size: 22px;
  margin: 10px;
}
hr {
  background-color: white;
  width: 75%;
}
</style>
