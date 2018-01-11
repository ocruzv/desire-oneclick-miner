const state = {
  mining: false,
  pids: [],
  gpu: 'nvidia',
};

const mutations = {
  ADD_PID(state, payload) {
    if (state.pids.indexOf(payload.pid === -1)) {
      state.pids.push(payload.pid);
    }
  },
  REMOVE_PID(state, payload) {
    // state.pids = state.pids.filter(pid => pid === payload.pid);
    if (state.pids.indexOf(payload.pid) !== -1) {
      state.pids.splice(state.pids.indexOf(payload.pid), 1);
    }
  },
  CHANGE_GPU(state, payload) {
    console.log(payload);
    state.gpu = payload.gpu;
  },
  TOGGLE_MINING(state) {
    state.mining = !state.mining;
  },
  RESTART_SYSTEM(state) {
    state.mining = false;
    state.pids = [];
  },
};

// const actions = {
//   someAsyncTask({ commit }) {
//     // do something async
//     commit('INCREMENT_MAIN_COUNTER');
//   },
// };

export default {
  state,
  mutations,
};
