export const state = () => ({
  tests: [],
});

export const mutations = {
  SET_TESTS(state, data) {
    state.tests = data;
  },
};

export const getters = {
  GET_TESTS(state) {
    return state.tests;
  },
};

export const actions = {
  async FETCH_TESTS({ commit }) {
    await this.$axios.$get("http://localhost:8888/tests/").then((data) => {
      commit("SET_TESTS", data);
    });
  }
};
