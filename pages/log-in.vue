<template>
  <v-layout wrap justify-center align-center fill-height>
    <v-flex md6>
      <div class="form-login">
        <div class="text-center mb-6">
          <h2 class="display-1">Log In</h2>
        </div>
        <v-form ref="login" v-model="valid" lazy-validation>
          <v-text-field
            label="Email"
            append-icon="mdi-account-circle-outline"
            v-model="frm.email"
            type="email"
            required
            :rules="[
              (v) => !!v || 'E-mail is required',
              (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ]"
          ></v-text-field>
          <v-text-field
            label="Passoword"
            :type="!showPass ? 'password' : 'text'"
            @click:append="showPass = !showPass"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            v-model="frm.password"
            counter=""
            :rules="[
              (v) => !!v || 'Password is required',
              (v) =>
                (v && v.length >= 8) ||
                'Password cannot be less than 8 characters',
            ]"
          ></v-text-field>
        </v-form>
        <v-btn @click.prevent="doLogin" color="primary" block>log in</v-btn>
        <nuxt-link class="mt-5" to="/sign-in">Create account</nuxt-link>
      </div>
    </v-flex>
    <v-flex md6 class="blue lighten-5" fill-height>
      <v-layout justify-center align-center fill-height>
        <img src="@/assets/login.svg" alt="" class="img" />
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  async fetch({ $axios, store }) {
    if (store.getters["users/GET_USERS"].length === 0) {
      store.dispatch("users/FETCH_USERS");
    }
  },
  computed: {
    users() {
      this.$store.getters["users/GET_USERS"];
    },
  },
  layout: "blank",
  data() {
    return {
      getUsers: [],
      showPass: false,
      valid: null,
      frm: {
        email: "",
        password: "",
      },
    };
  },
  async mounted() {
    if (this.$route.query.message) {
      this.$toast.warning("You should login to enter!");
    }
    if (this.$store.getters["users/GET_USERS"].length === 0) {
      await this.$store.dispatch("users/FETCH_USERS");
    }
    this.getUsers = this.$store.getters["users/GET_USERS"];
  },
  methods: {
    doLogin() {
      if (this.getUsers.length !== 0) {
        if (this.frm.email && this.frm.password) {
          for (let i = 0; i < this.getUsers.length; i++) {
            const element = this.getUsers[i];
            if (element.email === this.frm.email) {
              if (element.password == this.frm.password) {
                localStorage.setItem("currentUser", JSON.stringify(element));
                this.$store.dispatch("token/login");
                this.$router.push(`/?message=${element.id}`);
              }
              break;
            }
          }
        } else {
          this.$refs.login.validate();
          this.$toast.warning("Email or Password is incorrect");
        }
      } else {
        this.$toast.error("Account not found");
        setTimeout(() => {
          this.$toast.info("Please!!! Create your account");
        }, 1000);
      }
    },
  },
};
</script>

<style>
.img {
  max-width: 100%;
  max-height: 400px;
}

.form-login {
  max-width: 400px;
  margin: 0 auto;
}
</style>
