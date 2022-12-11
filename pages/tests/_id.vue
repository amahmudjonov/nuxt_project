<template>
  <div>
    <v-row>
      <div>
        <v-breadcrumbs large>
          <v-breadcrumbs-item>
            <nuxt-link tag="span" style="cursor: pointer" to="/tests"
              >Tests</nuxt-link
            >
          </v-breadcrumbs-item>
          <v-breadcrumbs disabled style="margin-left: -10px"> > </v-breadcrumbs>
          <v-breadcrumbs-item disabled>
            <span style="cursor: pointer">Test - {{ $route.params.id }}</span>
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </div>
    </v-row>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-col>
        <v-card class="mx-auto elevation-0">
          <v-card-title>Test name: {{ test.test_name }}</v-card-title>
        </v-card>
      </v-col>
      <v-card class="mx-auto elevation-3" max-width="90%" outlined>
        <v-tabs v-model="tab" background-color="green lighten-2" dark>
          <v-tab v-for="n in length" :key="n"> Question {{ n }} </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(item, n) in test.questions" :key="n">
            <v-col>
              <v-text-field
                readonly
                v-model="item.name"
                :rules="questionRule"
                :label="'Question' + (n + 1)"
                required
                outlined
                counter=""
              ></v-text-field>

              <v-col cols="3">
                <v-text-field
                  readonly
                  v-model="item.total_right_answers"
                  label="Total right answers"
                ></v-text-field>
              </v-col>

              <v-radio-group v-model="ex8">
                <v-row class="px-5">
                  <v-col cols="3">
                    <v-row>
                      <v-checkbox
                        value="false"
                        @change="() => checkedBox(item, 0)"
                        :color="item.answers[0].is_right ? 'success' : 'error'"
                        :disabled="item.answers[0].disabled"
                        hide-details
                        required
                        :rules="[(v) => !!v || 'Choose right answer']"
                      ></v-checkbox>

                      <v-text-field
                        readonly
                        v-model="item.answers[0].answer1"
                        :rules="answerRule"
                        label="Answer 1"
                        required
                        counter=""
                      ></v-text-field>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row class="px-5">
                  <v-col cols="3">
                    <v-row>
                      <v-checkbox
                        value="false"
                        @change="checkedBox(item, 1)"
                        :color="item.answers[1].is_right ? 'success' : 'error'"
                        :disabled="item.answers[1].disabled"
                        hide-details
                        required
                        :rules="[(v) => !!v || 'Choose right answer']"
                      ></v-checkbox>

                      <v-text-field
                        readonly
                        v-model="item.answers[1].answer2"
                        :rules="answerRule"
                        label="Answer 2"
                        required
                        counter=""
                      ></v-text-field>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row class="px-5">
                  <v-col cols="3">
                    <v-row>
                      <v-checkbox
                        value="false"
                        @change="(e) => checkedBox(item, 2)"
                        :color="item.answers[2].is_right ? 'success' : 'error'"
                        :disabled="item.answers[2].disabled"
                        hide-details
                        required
                        :rules="[(v) => !!v || 'Choose right answer']"
                      ></v-checkbox>

                      <v-text-field
                        readonly
                        v-model="item.answers[2].answer3"
                        :rules="answerRule"
                        label="Answer 3"
                        required
                        counter=""
                      ></v-text-field>
                    </v-row>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-col>
          </v-tab-item>
        </v-tabs-items>
        <v-col class="mb-5 mx-4">
          <v-row justify="center">
            <v-dialog v-model="dialog" width="500">
              <template #activator="{ on, attrs }">
                <v-btn
                  :disabled="test.questions.length <= 3"
                  color="warning"
                  dark
                  class="mb-2"
                  outlined
                  v-bind="attrs"
                  v-on="on"
                >
                  Cancel test
                </v-btn>
              </template>

              <v-card>
                <v-alert dense type="warning">
                  Are you sure you want to delete this student's data?
                </v-alert>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="warning" outlined text @click="dialog = false">
                    Cancel
                  </v-btn>
                  <v-btn color="warning" outlined text @click="cancelTest">
                    Yes
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-col>
      </v-card>
    </v-form>
  </div>
</template>

<!-- ########################################################################## -->

<script>
export default {
  async fetch({ store }) {
    await store.dispatch("tests/FETCH_TESTS");
  },
  computed: {
    getTests() {
      this.$store.getters["tests/GET_TESTS"];
    },
  },
  data: () => ({
    idx: null,
    ex8: "primary",
    length: 1,
    tab: 0,
    valid: true,
    dialog: false,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) =>
        (v && v.length >= 10) || "Name must not be less than 10 characters",
    ],
    questionRule: [
      (v) => !!v || "Question is required",
      (v) =>
        (v && v.length >= 10) || "Question must not be less than 10 characters",
    ],
    answerRule: [(v) => !!v || "Answer is required"],
    select: null,
    test: {
      id: null,
      test_name: "",
      questions: [
        {
          id: null,
          name: "",
          answers: [
            { answer1: "", is_right: false, disabled: false },
            { answer2: "", is_right: false, disabled: false },
            { answer3: "", is_right: false, disabled: false },
          ],
          total_right_answers: 1,
        },
      ],
    },
    rightAnswers1: false,
    rightAnswers2: false,
    rightAnswers3: false,
    check1: false,
    check2: false,
    check3: false,
    check: [false, false, false],
  }),

  watch: {
    rightAnswers(val) {
      this.test.questions[this.length - 1].total_right_answers = val;
    },
  },

  async mounted() {
    await this.$axios
      .$get(`http://localhost:8888/tests/${this.$route.params.id}`)
      .then((res) => {
        this.test = res;
        this.length = this.test.questions.length - 1;
      })
      .then(() => {
        this.test.questions.forEach((item) => {
          item.answers.forEach((el) => {
            el.disabled = false;
          });
        });
      });
  },

  methods: {
    checkedBox(item, id) {
      let index = this.test.questions.findIndex((el) => el.id === item.id);
      if (this.test.questions[index].total_right_answers === 1) {
        item.answers.forEach((el) => {
          el.disabled = true;
        });
      } else if (this.test.questions[index].total_right_answers === 2) {
        if (this.idx !== null) {
          item.answers.forEach((el) => {
            el.disabled = true;
          });
        } else {
          this.idx = id;
        }
      } else {
        item.answers[id].disabled = true;
      }

      if (
        this.test.questions[index].answers[id].is_right === true &&
        item.answers[id].is_right === true
      ) {
        this.$toast.success('Correct')
      } else {
        this.$toast.error('Error')
      }
    },

    async cancelTest() {
      await this.$router.push("/tests");
      this.dialog = false;
    },

    async saveTest() {
      const getTests = await this.$axios.$get("http://localhost:8888/tests");
      this.test.id = getTests.length + 1;

      var arr = [
        this.test.questions[this.length - 1].answers[0].answer1,
        this.test.questions[this.length - 1].answers[0].answer2,
        this.test.questions[this.length - 1].answers[0].answer3,
      ];
      if (arr[0] !== "" && arr[1] !== "" && arr[2] !== "") {
        this.$axios.$post("http://localhost:8888/tests", this.test).then(() => {
          this.$router.push("/tests");
        });
      } else {
        this.$refs.form.validate();
      }
    },
  },
};
</script>
