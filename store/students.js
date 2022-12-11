export const state = () => ({
  students: [],
});

export const mutations = {
  SET_STUDENTS(state, data) {
    state.students = data;
  },
};

export const getters = {
  GET_STUDENTS(state) {
    return state.students;
  },
};

export const actions = {
  async FETCH_STUDENTS({ commit }) {
    await this.$axios.$get("http://localhost:8888/students/").then((data) => {
      commit("SET_STUDENTS", data);
    });
  }
};
