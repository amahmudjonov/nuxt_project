export const state = () => ({
  users: [],
});

export const mutations = {
  SET_USERS(state, data) {
    state.users = data;
  },
};

export const getters = {
  GET_USERS(state) {
    return state.users;
  },
};

export const actions = {
  async FETCH_USERS({ commit }) {
    await this.$axios.$get("http://localhost:8888/users/").then((data) => {
      commit("SET_USERS", data);
    });
  },
};
