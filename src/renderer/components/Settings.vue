<template>
  <main>
    <h1>Settings</h1>
    <div class="wallet-address">
      <div class="field-container">
        <b-field label="Which pool do you want to use?">
          <b-select 
          v-model="poolSelected"
          placeholder="Select a pool">
            <option
              v-for="pool in pools"
              :value="pool.url"
              :key="pool.url">
              {{ pool.name }}
            </option>
            <option value="custom">Custom pool...</option>
          </b-select>
        </b-field>
      </div>
      <div class="field-container" v-if="poolSelected === 'custom'">
        <b-field label="Please enter the full Stratum URL Server with port">
          <b-input v-model="customPool" placeholder="stratum+tcp://pool.unimining.net:4234"></b-input>
        </b-field>
      </div>
      <div class="field-container">
        <label class="label">How do you want to mine?</label>
        <div class="block">
          <b-checkbox v-model="mineWith"
              native-value="gpu">
              GPU (Only Windows)
          </b-checkbox>
          <b-checkbox v-model="mineWith"
              native-value="cpu">
              CPU (Not recommended)
          </b-checkbox>
        </div>
      </div>
      <div class="field-container">
        <label class="label">Advanced</label>
        <div class="block">
          <b-checkbox v-model="advancedMode">
            Show mining console?
          </b-checkbox>
        </div>
      </div>
    </div>
    <div class="field is-grouped save-settings">
      <div class="control">
        <button class="button is-medium is-primary" @click="save()">Save settings</button>
      </div>
    </div>

    <div class="settings">
      <b-tooltip label="Return" :animated="true">
        <router-link to="landing-page" class=" is-text">
          <i class="fas fa-arrow-left"></i>
        </router-link>
      </b-tooltip>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      pools: [],
      customPool: '',
      poolSelected: null,
      mineWith: ['gpu'],
      advancedMode: false,
    };
  },
  methods: {
    save() {
      this.$store.commit('CHANGE_CURRENT_POOL', {
        pool: this.poolSelected,
        customPool: this.customPool,
      });
      this.$store.commit('CHANGE_MINE_WITH', {
        mineWith: this.mineWith,
      });
      this.$store.commit('CHANGE_ADVANCED_MODE', {
        advancedMode: this.advancedMode,
      });
      this.$toast.open({
        duration: 3000,
        message: 'Changes saved',
        position: 'is-bottom',
        type: 'is-success',
      });
    },
    getPools() {
      window.firebase.firestore()
        .collection('pools')
        .get()
        .then((pools) => {
          this.pools = [];
          pools.forEach((pool) => {
            this.pools.push(pool.data());
          });
        });
    },
  },
  created() {
    this.getPools();
    this.poolSelected = this.$store.state.Settings.currentPool;
    this.customPool = this.$store.state.Settings.customPool;
    this.mineWith = this.$store.state.Settings.mineWith;
    this.advancedMode = this.$store.state.Settings.advancedMode;
  },
};
</script>

<style lang="scss" scoped>
span.select,
select,
.select select:not([multiple]) {
  width: 100% !important;
}

.field-container {
  margin: 30px auto;
}

.save-settings {
  margin-top: 50px;

  .control {
    margin: 0 auto;
    text-align: center;
  }
}
</style>
