<template>
  <div id="app" class="full-height">
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted() {
    if (this.$api.getToken()) {
      // this.$store.dispatch("getGoodsType");
    }
  },
  data() {
    return {};
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
