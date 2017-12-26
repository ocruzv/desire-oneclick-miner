<template>
  <div id="console-view" ref="console">
    <p v-for="(log, index) in miner.console" :key="index">{{log}}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      miner: state => state.Miner,
      settings: state => state.Settings,
    }),
  },
  methods: {
    updateScroll() {
      const element = this.$refs.console;
      if (element) element.scrollTop = element.scrollHeight;
    },
  },
  created() {
    setInterval(this.updateScroll, 500);
  },
};
</script>


<style lang="scss">
  #console-view {
    background-color: rgb(15, 15, 15);
    width: 100%;
    height: 100px;
    overflow-y: auto;
    border-radius: 3px;
    padding: 5px;
    border: 1px solid $primary;
    margin-top: 30px;

    p {
      margin: 0;
      color: #fff;
      font-size: 0.8em;
      display: block;
    }
  }
</style>
