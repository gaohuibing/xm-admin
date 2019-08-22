<template>
  <div class="full-height" style="position:relative">
    <app-header></app-header>
    <div style="position:absolute;left:0;right:0;top:90px;bottom:30px;overflow-y:auto" id="wrap">
      <div class="main">
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>	
  </div>
</template>
 <script>
import AppHeader from "@/components/common/header";

export default {
  components: { AppHeader },
  mounted() {},
  data() {
    return {};
	},

  methods: {},
  watch: {}
};
</script>
 <style scoped>

</style>
 