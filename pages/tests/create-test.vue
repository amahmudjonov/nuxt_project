<template>
  <div>
    <v-row>
      <div>
        <v-breadcrumbs :items="items" large>
          <template #item="{ item }">
            <v-breadcrumbs-item :disabled="item.disabled">
              <nuxt-link tag="span" style="cursor: pointer" :to="item.route">{{
                item.text
              }}</nuxt-link>
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </div>
    </v-row>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-col>
        <v-card class="mx-auto mt-5 elevation-0">
          <v-text-field
            v-model="test.test_name"
            :rules="nameRules"
            label="Test name"
            required
            counter=""
            outlined
          ></v-text-field>
        </v-card>
      </v-col>
      <v-card class="mx-auto mt-5 elevation-3" max-width="90%" outlined>
        <v-tabs v-model="tab" background-color="green lighten-2" dark>
          <v-tab v-for="n in length" :key="n"> Question {{ n }} </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(item, n) in test.questions" :key="n">
            <v-col>
              <v-text-field
                v-model="item.name"
                :rules="questionRule"
                :label="'Question' + (n + 1)"
                required
                outlined
                counter=""
              ></v-text-field>

              <v-col cols="3">
                <v-select
                  :items="[1, 2, 3]"
                  v-model="item.total_right_answers"
                  label="Total right answers"
                  @change="selected"
                ></v-select>
              </v-col>

              <v-radio-group v-model="ex8">
                <v-row class="px-5">
                  <v-col cols="3">
                    <v-row>
                      <v-checkbox
                        v-model="item.answers[0].is_right"
                        @change="checkedBox"
                        color="success"
                        :disabled="item.answers[0].disabled"
                        hide-details
                        required
                        :rules="[(v) => !!v || 'Choose right answer']"
                      ></v-checkbox>

                      <v-text-field
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
                        v-model="item.answers[1].is_right"
                        @change="checkedBox"
                        color="success"
                        :disabled="item.answers[1].disabled"
                        hide-details
                        required
                        :rules="[(v) => !!v || 'Choose right answer']"
                      ></v-checkbox>

                      <v-text-field
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
                        v-model="item.answers[2].is_right"
                        @change="checkedBox"
                        color="success"
                        :disabled="item.answers[2].disabled"
                        hide-details
                        required
                        :rules="[(v) => !!v || 'Choose right answer']"
                      ></v-checkbox>

                      <v-text-field
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
            <v-card-text class="text-center">
              <v-row class="my-5" justify="center">
                <v-btn
                  outlined
                  color="primary"
                  :disabled="n == 0"
                  text
                  @click="removeTest"
                >
                  Remove test question</v-btn
                >
                <v-divider class="mx-4" vertical></v-divider>
                <v-btn
                  outlined
                  color="primary"
                  text
                  :disabled="n == 10"
                  @click="addTest"
                >
                  Add test question
                </v-btn>
              </v-row>
            </v-card-text>
          </v-tab-item>
        </v-tabs-items>
        <v-col class="mb-5 mx-4">
          <v-row justify="center">
            <v-btn
              :disabled="test.questions.length <= 3"
              color="primary"
              @click="saveTest"
              dark
              class="mb-2"
              outlined
            >
              Save
            </v-btn>
          </v-row>
        </v-col>
      </v-card>
    </v-form>
  </div>
</template>

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
    items: [
      {
        text: "Tests",
        disabled: false,
        route: "/tests",
      },
      {
        text: "Create new test",
        disabled: true,
        route: "/create-test",
      },
    ],
    ex8: "primary",
    length: 1,
    tab: null,
    valid: true,
    rightAnswers: 1,
    rightAnswers1: false,
    rightAnswers2: false,
    rightAnswers3: false,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) =>
        (v && v.length >= 10) || "Name must not be less than 10 characters",
    ],
    answer1: "",
    answer2: "",
    answer3: "",
    question: "",
    questionRule: [
      (v) => !!v || "Question is required",
      (v) =>
        (v && v.length >= 10) || "Question must not be less than 10 characters",
    ],
    answerRule: [(v) => !!v || "Answer is required"],
    select: null,
    // items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false,
    check1: false,
    check2: false,
    check3: false,
    checked: [false, false, false, false],

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
  }),

  watch: {
    length(val) {
      this.tab = val - 1;
    },
    rightAnswers(val) {
      this.test.questions[this.length - 1].total_right_answers = val;
    },
  },

  methods: {
    selected() {
      if (this.test.questions[this.length - 1].total_right_answers !== 1) {
        this.checkedBox();
      } else {
        this.test.questions[this.length - 1].answers.forEach(
          (el) => (el.is_right = false)
        );
      }
    },
    checkedBox(e) {
      if (e) {
        let num = this.test.questions[this.length - 1].answers.filter(
          (el) => el.is_right == e
        ).length;
        if (this.test.questions[this.length - 1].total_right_answers == 1) {
          let a = this.test.questions[this.length - 1].answers.findIndex(
            (el) => el.is_right === e
          );
          if (a === 0) {
            this.test.questions[this.length - 1].answers[1].disabled = e;
            this.test.questions[this.length - 1].answers[2].disabled = e;
          } else if (a === 1) {
            this.test.questions[this.length - 1].answers[0].disabled = e;
            this.test.questions[this.length - 1].answers[2].disabled = e;
          } else if (a === 2) {
            this.test.questions[this.length - 1].answers[0].disabled = e;
            this.test.questions[this.length - 1].answers[1].disabled = e;
          }
        } else if (
          this.test.questions[this.length - 1].total_right_answers == num &&
          this.test.questions[this.length - 1].total_right_answers !== 3
        ) {
          let a = this.test.questions[this.length - 1].answers.findIndex(
            (el) => el.is_right !== e
          );
          a === 2
            ? (this.test.questions[this.length - 1].answers[2].disabled = e)
            : a === 1
            ? (this.test.questions[this.length - 1].answers[1].disabled = e)
            : (this.test.questions[this.length - 1].answers[0].disabled = e);
        }
      } else {
        this.test.questions[this.length - 1].answers[0].disabled = e;
        this.test.questions[this.length - 1].answers[1].disabled = e;
        this.test.questions[this.length - 1].answers[2].disabled = e;
      }
    },
    addTest() {
      let num = this.test.questions[this.length - 1].answers.filter(
        (el) => el.is_right == true
      ).length;
      let answers = [
        this.test.questions[this.length - 1].answers[0].answer1,
        this.test.questions[this.length - 1].answers[0].answer2,
        this.test.questions[this.length - 1].answers[0].answer3,
      ].filter((el) => el !== "");
      this.test.questions[this.length - 1].id = this.length;
      if (
        num !== 0 &&
        answers.length === 3 &&
        this.test.test_name !== "" &&
        this.test.questions[this.length - 1].name !== ""
      ) {
        this.length++;
        this.test.questions.push({
          id: this.length + 1,
          name: "",
          answers: [
            { answer1: "", is_right: false, disabled: false },
            { answer2: "", is_right: false, disabled: false },
            { answer3: "", is_right: false, disabled: false },
          ],
          total_right_answers: 1,
        });
        console.log(this.test);
        this.checkedBox(false);
      } else {
        this.$refs.form.validate();
      }
    },
    removeTest() {
      this.test.questions = this.test.questions.slice(0, -1);
      this.length--;
      console.log(this.test);
    },
    reset() {
      this.$refs.form.reset();
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
          this.$toast.success("Test successfully saved");
          this.$router.push("/tests");
        });
      } else {
        this.$refs.form.validate();
      }
    },
  },
};
</script>
