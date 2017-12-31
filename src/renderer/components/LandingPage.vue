<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="desire-coin">
    <main>
      <h1>Desire Miner</h1>
      <div class="wallet-address">
        <b-field label="Your DSR Wallet Address">
            <b-input v-model="wallet"></b-input>
        </b-field>
      </div>
      <Numbers v-if="!settings.advancedMode"></Numbers>
      <Console v-if="settings.advancedMode"></Console>
      <div class="field is-grouped start-mining">
        <div class="control">
          <button class="button is-medium is-primary" @click="startMine()" v-if="!system.mining">Start mining</button>
          <button class="button is-medium is-primary" @click="stopMine()" v-if="system.mining">Stop mining</button>
        </div>
      </div>
      <div class="donations">
        <p>Donations (DSR): DJMLtWSp7M1Dy2g18SyBLJD4kw3RfiNVz9</p>
      </div>
      <div class="settings">
        <b-tooltip label="Settings" :animated="true">
          <router-link to="settings" class=" is-text">
            <i class="fas fa-cog"></i>
          </router-link>
        </b-tooltip>
      </div>
    </main>
  </div>
</template>

<script>
import { execFile, exec } from 'child_process';
import { mapState, mapGetters } from 'vuex';
import path from 'path';
import Numbers from './Statistics/Numbers';
import Console from './Statistics/Console';

export default {
  name: 'landing-page',
  data() {
    return {
      platform: require('os').platform(),
      gpu: 'amd',
    };
  },
  components: {
    Numbers,
    Console,
  },
  computed: {
    ...mapState({
      settings: state => state.Settings,
      system: state => state.System,
    }),
    ...mapGetters({
      currentPool: 'getCurrentPool',
    }),
    wallet: {
      get() {
        return this.$store.state.Settings.wallet;
      },
      set(value) {
        this.$store.commit('CHANGE_WALLET_ADDRESS', {
          wallet: value,
        });
      },
    },
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    startMine() {
      this.$toast.open({
        duration: 3000,
        message: 'Here we go!',
        position: 'is-bottom',
        type: 'is-primary',
      });

      if (this.settings.mineWith.includes('cpu')) {
        this.mineWithCpu();
      }

      if ((this.platform === 'win32' || this.platform === 'win')
      && this.settings.mineWith.includes('gpu')) {
        this.mineWithGpu();
      }
      this.$store.commit('RESET_MINER_STATUS');
      this.$store.commit('TOGGLE_MINING');
    },
    getGpu() {
      exec('wmic path win32_VideoController get name', (error, stdout, stderr) => {
        if (stdout.indexOf('NVIDIA') > -1 || stderr.indexOf('NVIDIA') > -1) {
          this.gpu = 'nvidia';
        } else {
          this.gpu = 'amd';
        }
      });
    },
    mineWithCpu() {
      let minerPath = `miners/${this.platform}/minerd`;
      if (this.platform === 'win32' || this.platform === 'win') {
        minerPath = `${minerPath}.exe`;
      }

      const miner = execFile(path.join(__static, minerPath),
        ['--algo=neoscrypt',
          `--url=${this.currentPool}`,
          `--user=${this.settings.wallet}`,
          '-p c=DSR']);

      this.$store.commit('ADD_PID', {
        pid: miner.pid,
      });

      miner.stdout.on('data', (data) => {
        this.$store.commit('APPEND_CONSOLE', {
          log: data,
        });

        if (typeof data === 'string' && data.split(' ')[2] === 'thread') {
          this.$store.commit('UPDATE_CPU_SPEED', {
            isShare: false,
            speed: data.replace(/.*thread \d+: \d+ hashes, (\d+(\.\d+)?) KH\/s/, '$1'),
          });
        } else if (typeof data === 'string' && data.split(' ')[2] === 'accepted:') {
          this.$store.commit('UPDATE_CPU_SPEED', {
            isShare: true,
            speed: data.replace(/.*accepted: \d+\/\d+ \(.+\), (\d+(\.\d+)?) .*/, '$1'),
          });
        }
      });

      miner.stderr.on('data', (data) => {
        this.$store.commit('APPEND_CONSOLE', {
          log: data,
        });

        if (typeof data === 'string' && data.split(' ')[2] === 'thread') {
          this.$store.commit('UPDATE_CPU_SPEED', {
            isShare: false,
            speed: data.replace(/.*thread \d+: \d+ hashes, (\d+(\.\d+)?) KH\/s/, '$1'),
          });
        } else if (typeof data === 'string' && data.split(' ')[2] === 'accepted:') {
          this.$store.commit('UPDATE_CPU_SPEED', {
            isShare: true,
            speed: data.replace(/.*accepted: \d+\/\d+ \(.+\), (\d+(\.\d+)?) .*/, '$1'),
          });
        }
      });

      miner.on('close', () => {
        this.$store.commit('APPEND_CONSOLE', {
          log: 'CPU Miner is now stopped',
        });
        this.$toast.open({
          duration: 3000,
          message: 'CPU miner is now stopped',
          position: 'is-bottom',
          type: 'is-primary',
        });
      });
    },
    mineWithGpu() {
      const minerPath = `miners/${this.platform}/${this.gpu}`;
      let miner;
      // if (this.platform === 'win32' || this.platform === 'win') {
      //   minerPath = `${minerPath}.exe`;
      // }
      if (this.gpu === 'nvidia') {
        miner = execFile(`${path.join(__static, minerPath)}/miner`,
          ['--algo=neoscrypt',
            `--url=${this.currentPool}`,
            `--user=${this.settings.wallet}`,
            '-p c=DSR']);
      } else {
        miner = exec(`set GPU_MAX_ALLOC_PERCENT=100 && \
          set GPU_USE_SYNC_OBJECTS=1 && \
          set GPU_FORCE_64BIT_PTR=1 && \
          set GPU_MAX_HEAP_SIZE=100 && \
          set GPU_SINGLE_ALLOC_PERCENT=100 && \
          start cmd.exe /K ${path.join(__static, minerPath)}/miner \
          --default-config="${path.join(__static, minerPath)}/miner-config.conf" \
          --kernel-path=""${path.join(__static, minerPath)}/kernel"`);
      }

      this.$store.commit('ADD_PID', {
        pid: miner.pid,
      });

      miner.stderr.on('data', (data) => {
        this.$store.commit('APPEND_CONSOLE', {
          log: data,
        });

        if (typeof data === 'string' && data.split(' ')[2] === 'accepted:') {
          const speed = data.split(' ')[data.split(' ').length - 3];
          this.$store.commit('UPDATE_GPU_SPEED', {
            speed,
          });
        }
      });

      miner.on('close', () => {
        this.$store.commit('APPEND_CONSOLE', {
          log: 'GPU Miner is now stopped',
        });
        this.$toast.open({
          duration: 3000,
          message: 'GPU miner is now stopped',
          position: 'is-bottom',
          type: 'is-primary',
        });
      });
    },
    stopMine() {
      this.system.pids.forEach((pid) => {
        // if (this.platform === 'win32') {
        //   pid += pid;
        // }
        try {
          process.kill(pid, 'SIGINT');
          this.$store.commit('REMOVE_PID', {
            pid,
          });
        } catch (e) {
          this.$toast.open({
            duration: 3000,
            message: `The process doesnt exists ${e}`,
            position: 'is-bottom',
            type: 'is-danger',
          });
        }
      });
      this.$store.commit('RESET_MINER_STATUS');
      this.$store.commit('TOGGLE_MINING');
    },
  },
  created() {
    this.getGpu();
  },
};
</script>

<style lang="scss" scoped>
  #logo {
    height: auto;
    width: 80px;
    display: block;
    margin: 0 auto 10px;
  }

  .wallet-address {
    margin-top: 50px;
  }

  .donations {
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-size: 0.8em;
  }

  .start-mining {
    margin-top: 50px;

    .control {
      margin: 0 auto;
    }
  }
</style>
