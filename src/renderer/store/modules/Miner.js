const state = {
  gpuSpeed: 0,
  cpuSpeed: {
    isShare: false,
    speed: 0,
  },
  temps: [],
  shares: 0,
  console: [],
};

const mutations = {
  UPDATE_GPU_SPEED(state, payload) {
    state.gpuSpeed = payload.speed;
    state.shares += 1;
  },
  UPDATE_CPU_SPEED(state, payload) {
    if (payload.isShare) {
      state.cpuSpeed.isShare = true;
    }
    if (!state.isShare && !payload.isShare) {
      state.cpuSpeed.speed = payload.speed;
    } else if (state.isShare && payload.isShare) {
      state.cpuSpeed.speed = payload.speed;
      state.shares += 1;
    }
  },
  RESET_MINER_STATUS(state) {
    state.gpuSpeed = 0;
    state.cpuSpeed = {
      isShare: false,
      speed: 0,
    };
    state.temps = [];
    state.shares = 0;
    state.console = [];
  },
  UPDATE_TEMPS(state, payload) {
    state.temps = payload.temps;
  },
  UPDATE_SHARES(state, payload) {
    state.shares = payload.shares;
  },
  APPEND_CONSOLE(state, payload) {
    state.console.push(payload.log);
  },
};

export default {
  state,
  mutations,
};
