const state = {
  currentPool: 'stratum+tcp://pool.unimining.net:4234',
  customPool: '',
  mineWith: [],
  wallet: 'DJMLtWSp7M1Dy2g18SyBLJD4kw3RfiNVz9',
  advancedMode: false,
};

const mutations = {
  CHANGE_CURRENT_POOL(state, payload) {
    state.currentPool = payload.pool;
    state.customPool = payload.customPool;
  },
  CHANGE_MINE_WITH(state, payload) {
    state.mineWith = payload.mineWith;
  },
  CHANGE_WALLET_ADDRESS(state, payload) {
    state.wallet = payload.wallet;
  },
  CHANGE_ADVANCED_MODE(state, payload) {
    state.advancedMode = payload.advancedMode;
  },
};

const getters = {
  getCurrentPool: (state) => {
    let currentPool;
    if (state.currentPool === 'custom') {
      currentPool = state.customPool;
    } else {
      currentPool = state.currentPool;
    }
    return currentPool;
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
  getters,
  mutations,
};
