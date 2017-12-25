<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'desire-oneclick-miner',
    data() {
      return {
        platform: require('os').platform(),
      };
    },
    created() {
      this.$store.commit('RESTART_SYSTEM');
      this.$store.commit('RESET_MINER_STATUS');
      if (this.platform !== 'win32' || this.platform !== 'win') {
        this.$store.commit('CHANGE_MINE_WITH', {
          mineWith: [],
        });
      }
    },
  };
</script>

<style lang="scss">
  /* SCSS */
</style>
