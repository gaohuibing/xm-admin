<template>
  <div>
    <div class="tabs">
      <ul>
        <router-link
          tag="li"
          v-for="(item, index) in tabs"
          :key="index"
          :to="item.path"
          active-class="active"
        >{{item.name}}</router-link>
      </ul>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        { path: "/systemmanage/team/list/user", name: "用户" },
        { path: "/systemmanage/team/list/role", name: "角色" }   
      ]
    };
  }
};
</script>

<style scoped>
</style>
