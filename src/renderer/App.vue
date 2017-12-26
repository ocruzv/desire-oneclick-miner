<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'desire-oneclick-miner',
    created() {
      this.$store.commit('RESTART_SYSTEM');
      this.$store.commit('RESET_MINER_STATUS');
      if (require('os').platform() !== 'win32') {
        this.$store.commit('CHANGE_MINE_WITH', {
          mineWith: ['cpu'],
        });
      }
    },
  };
</script>

<style lang="scss">
  /* SCSS */
</style>
