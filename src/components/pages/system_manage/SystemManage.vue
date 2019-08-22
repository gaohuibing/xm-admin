<template>
  <div class="clearfix">
    <app-sider></app-sider>

    <!-- <vue-scrollbar class="my-scrollbar full-height" ref="Scrollbar"> -->
      <div class="wrap" :style="{'min-height':wrapHeight+'px'}">
        <router-view></router-view>
      </div>
    <!-- </vue-scrollbar> -->
  </div>
</template>
<script>
const deviceHeight = document.documentElement.clientHeight;
import AppSider from "./Sider";
import VueScrollbar from "vue2-scrollbar";

export default {
  components: { AppSider, VueScrollbar },
  mounted() {
		
	},
  data() {
    return {};
	},
		computed:{
		wrapHeight(){
			return deviceHeight-130
		}
	},
};
</script>
<style scoped>
</style>
