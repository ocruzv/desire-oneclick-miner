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
    },
  };
</script>

<style lang="scss">
  /* SCSS */
</style>
