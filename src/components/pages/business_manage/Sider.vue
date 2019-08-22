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
          name: "商户概况",
          path: "/businessmanage/business"
        },
        {
          name: "企业认证审核",
          path: "/businessmanage/authentication"
        }      
      ]
    };
  }
};
</script>
<style scoped>
</style>
