<template>
  <v-layout wrap justify-center align-center fill-height>
    <v-flex md6>
      <div class="form-login">
        <v-form ref="signin" v-model="valid" lazy-validation>
          <div class="text-center mb-6">
            <h2 class="display-1">Sign In</h2>
          </div>
          <v-text-field
            append-icon="mdi-account-circle-outline"
            v-model="frm.first_name"
            :rules="[
              (v) => !!v || 'First name is required',
              (v) =>
                (v && v.length >= 3) ||
                'First name cannot be less than 3 characters',
            ]"
            label="First name"
            required
          ></v-text-field>
          <v-text-field
            append-icon="mdi-account-circle-outline"
            v-model="frm.last_name"
            :rules="[
              (v) => !!v || 'First name is required',
              (v) =>
                (v && v.length >= 3) ||
                'First name cannot be less than 3 characters',
            ]"
            label="Last name"
            required
          ></v-text-field>

          <v-text-field
            label="Email"
            append-icon="mdi-at"
            v-model="frm.email"
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
                'First name cannot be less than 8 characters',
            ]"
          ></v-text-field>
          <v-text-field
            v-model="confirm_password"
            :type="!showPass ? 'password' : 'text'"
            @click:append="showPass = !showPass"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            counter=""
            :rules="[
              (v) => !!v || 'Password is required',
              (v) =>
                (v && v.length >= 8) ||
                'First name cannot be less than 8 characters',
              (v) => v === frm.password || 'Confirm password is incorrect',
            ]"
            label="Confirm password"
            required
          ></v-text-field>
          <v-btn @click.prevent="signIn" color="primary" block>Sign in</v-btn>
          <nuxt-link class="mt-5" to="/log-in">Log in</nuxt-link>
        </v-form>
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
  layout: "blank",

  async asyncData({ $axios }) {
    const users = await $axios.$get("http://localhost:8888/users");
    return { users };
  },

  data() {
    return {
      showPass: false,
      valid: null,
      frm: {
        id: null,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      },
      confirm_password: "",
    };
  },
  methods: {
    async signIn() {
      const { first_name, last_name, email, password } = this.frm;
      this.frm.id = this.users.length + 1;
      if (
        first_name &&
        last_name &&
        email &&
        password &&
        this.confirm_password &&
        password === this.confirm_password
      ) {
        try {
          await this.$axios
            .$post("http://localhost:8888/users", this.frm)
            .then(() => {
              this.$toast.success("Your accoutn is successfuly created");
            })
            .then(() => {
              this.$router.push("/log-in");
            });
        } catch (error) {
          this.$toast.error("Failed");
        }
      } else {
        this.$refs.signin.validate();
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
