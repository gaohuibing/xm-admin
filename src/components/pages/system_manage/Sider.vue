<template>
  <div class="sider">
    <ul>
      <router-link
        tag="li"
        v-for="(item, index) in sideMenu"
        :key="index"
        :to="item.path"
        active-class="active"
      >{{item.name}}</router-link>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sideMenu: [
        {
          name: "平台概况",
          path: "/systemmanage/system"
        },
        {
          name: "控制中心",
          path: "/systemmanage/control"
        },
        {
          name: "团队管理",
          path: "/systemmanage/team"
        },
        {
          name: "分类管理",
          path: "/systemmanage/class"
	  },
	  {
          name: "通知管理",
          path: "/systemmanage/notice"
	  },
	  {
          name: "帮助管理",
          path: "/systemmanage/help1"
	  },
	  {
          name: "客服管理",
          path: "/systemmanage/customer"
        },
      ]
    };
  }
};
</script>
<style scoped>
</style>
