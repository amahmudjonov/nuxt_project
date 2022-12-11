<template>
  <div>
    <!-- <pre>{{ tests }}</pre> -->
    <v-container grid-list-xs fluid>
      <v-row>
        <v-col>
          <template>
            <v-data-table
              :headers="headers"
              :items="tests"
              class="elevation-1"
              :loading="loading"
              :loading-text="
                loading
                  ? `Loading... Please wait`
                  : `There is no records to show`
              "
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title class="title grey--text"
                    >Tests</v-toolbar-title
                  >
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" dark class="mb-2" outlined>
                    <nuxt-link tag="span" to="/tests/create-test">
                      Create new test
                    </nuxt-link>
                  </v-btn>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-alert dense type="error">
                        Are you sure you want to delete this test?
                      </v-alert>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template #item.id="{ index }">
                {{ index + 1 }}
              </template>
              <template #item.questions="{ item }">
                <span>{{ item.questions.length }}</span>
              </template>
              <template #item.difficulty="{ item }">
                <v-chip :color="getColor(item.questions)" small dark>
                  {{
                    item.questions.length >= 7
                      ? "Hard"
                      : item.questions.length >= 4
                      ? "Medium"
                      : "Easy"
                  }}
                </v-chip>
              </template>
              <template #item.try="{ item }">
                <v-btn @click="rowClicked(item)" icon>
                  <v-icon dark>mdi-lightbulb-on</v-icon>
                </v-btn>
              </template>
              <template #item.actions="{ item }">
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
              </template>
            </v-data-table>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  async fetch({ store }) {
    if (store.getters["tests/GET_TESTS"].length === 0) {
      await store.dispatch("tests/FETCH_TESTS");
    }
  },
  data: () => ({
    loading: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "ID",
        align: "center",
        sortable: false,
        value: "id",
      },
      {
        align: "center",
        text: "Test name",
        value: "test_name",
        sortable: false,
      },
      {
        align: "center",
        text: "Questions count",
        value: "questions",
        sortable: false,
      },
      {
        align: "center",
        text: "Difficulty",
        value: "difficulty",
        sortable: false,
      },
      {
        align: "center",
        text: "Try this test",
        value: "try",
        sortable: false,
      },
      { align: "center", text: "Actions", value: "actions", sortable: false },
    ],
    testId: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    tests() {
      return this.$store.getters["tests/GET_TESTS"];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    getColor(questions) {
      if (questions.length >= 7) return "red";
      else if (questions.length >= 4) return "orange";
      else return "green";
    },

    deleteItem(item) {
      this.testId = item.id;
      this.dialogDelete = true;
    },

    async refresh() {
      await this.$store.dispatch("tests/FETCH_TESTS");
    },

    async deleteItemConfirm() {
      await this.$axios
        .$delete(`http://localhost:8888/tests/${this.testId}`)
        .then((result) => {
          this.closeDelete();
          this.refresh();
          this.$toast.info("Test deleted");
        });
    },

    rowClicked(item) {
      this.$router.push(`/tests/${item.id}`);
    },

    close() {
      this.dialog = false;
    },

    closeDelete() {
      this.dialogDelete = false;
    },
  },
};
</script>
<style></style>
