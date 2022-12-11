<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-row>
        <v-col>
          <div>
            <v-data-table
              :headers="headers"
              :items="this.filteredStudents"
              sort-by="calories"
              class="elevation-1"
              item-key="name"
              :loading="loading"
              :loading-text="
                loading
                  ? `Loading... Please wait`
                  : `There is no records to show`
              "
            >
              <template #top>
                <v-toolbar flat>
                  <v-toolbar-title class="title grey--text"
                    >Students</v-toolbar-title
                  >
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer>
                    <v-text-field
                      class="search-input"
                      placeholder="Search"
                      filled
                      full-width
                      hide-details
                      flat
                      dense
                      prepend-inner-icon="mdi-magnify"
                      @input="search"
                    ></v-text-field>
                  </v-spacer>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        outlined
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Add new student
                      </v-btn>
                    </template>

                    <!-- Modal -->
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                  v-model="editedItem.first_name"
                                  label="First name"
                                  :rules="[
                                    (v) => !!v || 'First name is required',
                                    (v) =>
                                      (v && v.length >= 3) ||
                                      'First name must not be less than 3 characters',
                                  ]"
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                  v-model="editedItem.last_name"
                                  label="Last name"
                                  :rules="[
                                    (v) => !!v || 'Last name is required',
                                    (v) =>
                                      (v && v.length >= 3) ||
                                      'Last name must not be less than 3 characters',
                                  ]"
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-menu
                                  v-model="vDatePicker"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="auto"
                                >
                                  <template #activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="editedItem.birth_date"
                                      label="Birth date"
                                      prepend-icon="mdi-calendar"
                                      v-bind="attrs"
                                      v-on="on"
                                      required
                                      readonly
                                      :rules="[
                                        (v) => !!v || 'Date pick is required',
                                      ]"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="editedItem.birth_date"
                                    @input="vDatePicker = false"
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                  v-model="editedItem.email"
                                  label="Email"
                                  type="email"
                                  :rules="emailRules"
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                  v-model="editedItem.phone_number"
                                  label="Phone number"
                                  type="number"
                                  placeholder="+(998)"
                                  :rules="[
                                    (v) => !!v || 'Phone number is required',
                                    (v) =>
                                      (v && v.length >= 9) ||
                                      'Phone number must not be less than 9 characters',
                                  ]"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-select
                                  v-model="editedItem.course_level"
                                  :rules="[
                                    (v) =>
                                      !!v || 'Select course level is required',
                                  ]"
                                  :items="[1, 2, 3, 4]"
                                  label="Course level"
                                  required
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-form>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">
                          Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="save">
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>

                    <!-- Modal -->
                  </v-dialog>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-alert dense type="error">
                        Are you sure you want to delete this student's data?
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
                <span>{{ index + 1 }}</span>
              </template>
              <template #item.actions="item">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
              </template>
            </v-data-table>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  async fetch({ store }) {
    if (store.getters['students/GET_STUDENTS'].length === 0) {
      await store.dispatch("students/FETCH_STUDENTS");
    }
  },
  data: () => ({
    edit: false,
    dialog: false,
    dialogDelete: false,
    loading: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    vDatePicker: false,
    headers: [
      {
        text: "#",
        align: "center",
        sortable: false,
        value: "id",
      },
      { align: "center", text: "Full name", value: "name", sortable: false },
      { align: "center", text: "Email", value: "email", sortable: false },
      { align: "center", text: "Course level", value: "course_level" },
      {
        align: "center",
        text: "Phone number",
        value: "phone_number",
        sortable: false,
      },
      {
        align: "center",
        text: "Birth date",
        value: "birth_date",
        sortable: false,
      },
      { align: "center", text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: null,
      birth_date: null,
      course_level: null,
    },
    defaultItem: {
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: null,
      birth_date: null,
      course_level: null,
    },
    valid: false,
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    filteredStudents: [],
  }),

  computed: {
    students() {
      return this.$store.getters["students/GET_STUDENTS"];
    },
    formTitle() {
      return this.edit ? "Edit student's information" : "Add new student";
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

  mounted() {
    this.filteredStudents = this.students;
  },

  methods: {
    search(e) {
      this.filteredStudents = this.$store.getters["students/GET_STUDENTS"];

      this.filteredStudents = this.filteredStudents.filter((el) =>
        el.name.toLowerCase().includes(e)
      );
    },

    editItem(item) {
      this.edit = true;

      const { id, name, email, phone_number, birth_date, course_level } =
        item.item;
      this.dialog = true;
      this.editedItem = {
        id: id,
        first_name: name.split(" ")[0],
        last_name: name.split(" ")[1],
        email: email,
        phone_number: phone_number,
        course_level: course_level,
        birth_date: birth_date,
      };
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;

      this.editedItem.id = item.item.id;
    },

    async deleteItemConfirm() {
      await this.$axios
        .$delete("http://localhost:8888/students/" + this.editedItem.id)
        .then((res) => {
          this.refresh();
          this.close();
        });
      this.closeDelete();
      this.$toast.info(`Student's data deleted`);
    },

    close() {
      this.dialog = false;
      this.edit = false;
      // this.$nextTick(() => {
      //   this.editedItem = Object.assign({}, this.defaultItem);
      // });
      this.$refs.form.reset();
    },

    closeDelete() {
      this.dialogDelete = false;
      // this.$nextTick(() => {
      //   this.editedItem = Object.assign({}, this.defaultItem);
      //   this.editedIndex = -1;
      // });
    },

    refresh() {
      this.$store.dispatch("students/FETCH_STUDENTS").then(() => {
        this.filteredStudents = [...this.students];
      });
    },

    async save() {
      this.$refs.form.validate();
      if (this.edit) {
        const {
          id,
          first_name,
          last_name,
          email,
          phone_number,
          birth_date,
          course_level,
        } = this.editedItem;
        if (
          first_name &&
          last_name &&
          email &&
          phone_number &&
          birth_date &&
          course_level
        ) {
          let data = {
            id: id,
            name: `${first_name} ${last_name}`,
            email: email,
            phone_number: phone_number,
            course_level: course_level,
            birth_date: birth_date,
          };
          await this.$axios
            .$patch("http://localhost:8888/students/" + id, data)
            .then((res) => {
              this.refresh();
              this.close();
              this.$toast.success(`Student's data successfully changed`);
            });
        }
      } else {
        const {
          first_name,
          last_name,
          email,
          phone_number,
          birth_date,
          course_level,
        } = this.editedItem;
        if (
          first_name &&
          last_name &&
          email &&
          phone_number &&
          birth_date &&
          course_level
        ) {
          let data = {
            id: this.students.length + 1 ?? 1,
            name: `${first_name} ${last_name}`,
            email: email,
            phone_number: phone_number,
            course_level: course_level,
            birth_date: birth_date,
          };
          await this.$axios
            .$post("http://localhost:8888/students/", data)
            .then((res) => {
              this.refresh();
              this.close();
              this.$toast.success(`Student's data successfully saved`);
            });
        }
      }
    },
  },
};
</script>

<style></style>
