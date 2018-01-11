<template>
  <section id="minerInfo">
    <div class="container">
      <div class="columns is-mobile has-text-centered">
        <div class="column is-4">
          <h2>Unpaid</h2>
          <div><span class="tag is-primary is-normal">{{earned.unpaid}} DSR</span></div>
        </div>
        <div class="column is-4">
          <h2>Paid last 24 hrs</h2>
          <div><span class="tag is-primary is-normal">{{earned.lastday}} DSR</span></div>
        </div>
        <div class="column is-4">
          <h2>All time</h2>
          <div><span class="tag is-primary is-normal">{{earned.allTime}} DSR</span></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      earned: {
        unpaid: 0,
        lastday: 0,
        allTime: 0,
      },
    };
  },
  computed: {
    ...mapState({
      settings: state => state.Settings,
    }),
  },
  methods: {
    fetchPoolData() {
      axios.get(`http://blockeater.shardkeeper.com/api/wallet?address=${this.settings.wallet}`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.fetchPoolData();
  },
};
</script>

<style lang="scss">
  #minerInfo {
    margin-top: 30px;
  }
</style>
