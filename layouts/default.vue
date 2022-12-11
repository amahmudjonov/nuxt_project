<template>
  <v-app dark>
    <v-navigation-drawer
      outlined
      color="grey lighten-4"
      app
      permanent
      floating
      width="120"
    >
      <v-layout outlined column justify-center fill-height>
        <div>
          <v-list-item>
            <v-list-item-title class="text-center mt-2"> </v-list-item-title>
          </v-list-item>
        </div>

        <v-list nav>
          <template v-for="(item, index) in items">
            <v-list-item
              :to="item.link"
              nuxt
              :key="index"
              :title="item.title"
              justify-center
            >
              <v-list-item-content>
                <v-avatar size="36" width="64" class="text-center">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-avatar>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>

        <!-- <div>
          <v-list-item>
            <v-list-item-content class="text-center">
              <div>
                <v-avatar size="48" color="grey lighten-4">
                  <img src="@/static/icon.png" alt="alt" />
                </v-avatar>
              </div>
            </v-list-item-content>
          </v-list-item>
        </div> -->
      </v-layout>
    </v-navigation-drawer>

    <v-app-bar outlined flat app fixed>
      <v-spacer></v-spacer>
      <div>
        <v-row justify="end">
          <v-spacer></v-spacer>
          <v-menu bottom min-width="200px" rounded offset-y>
            <template v-slot:activator="{ on }">
              <v-btn icon x-large v-on="on">
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
              </v-btn>
            </template>
            <v-card>
              <v-list-item-content class="justify-center">
                <div class="mx-auto text-center">
                  <v-avatar style="cursor: pointer" color="brown">
                    <nuxt-link tag="span" to="/"
                      ><span class="white--text text-h5">{{
                        user.initials
                      }}</span></nuxt-link
                    >
                  </v-avatar>
                  <v-divider class="my-3"></v-divider>
                  <h3>{{ user.fullName }}</h3>
                  <p class="text-caption mt-1">
                    {{ user.email }}
                  </p>
                  <v-divider class="my-3"></v-divider>
                  <v-btn depressed text>
                    <v-icon class="mx-1">{{ icons.mdiLogoutVariant }}</v-icon>
                    <nuxt-link tag="span" @click="logout" to="/log-in"
                      >Log out</nuxt-link
                    >
                  </v-btn>
                </div>
              </v-list-item-content>
            </v-card>
          </v-menu>
        </v-row>
      </div>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import {
  mdiAccount,
  mdiPencil,
  mdiShareVariant,
  mdiDelete,
  mdiLoginVariant,
  mdiLogoutVariant,
} from "@mdi/js";
export default {
  async fetch(store) {
    if (store.getters["users/GET_USERS"].length === 0) {
      await store.dispatch("users/FETCH_USERS");
    }
  },
  middleware: ["auth"],
  computed: {
    users() {
      this.$store.getters["users/GET_USERS"];
    },
  },
  async mounted() {
    const res = await JSON.parse(localStorage.getItem("currentUser"));
    this.user.initials = `${res.first_name.charAt()}${res.last_name.charAt()}`;
    this.user.fullName = `${res.first_name} ${res.last_name}`;
    this.user.email = res.email;
  },
  data() {
    return {
      items: [
        { link: "/", icon: "mdi-apps", title: "Dasboard" },
        { link: "/tests", icon: "mdi-equalizer-outline", title: "Tests" },
        { link: "/log-in", icon: "mdi-power", title: "Log out" },
      ],
      user: {
        initials: "JD",
        fullName: "John Doe",
        email: "john.doe@doe.com",
      },
      icons: {
        mdiAccount,
        mdiPencil,
        mdiShareVariant,
        mdiDelete,
        mdiLoginVariant,
        mdiLogoutVariant,
      },
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("token/logout");
    },
  },
};
</script>

<style></style>
