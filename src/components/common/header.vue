<template>
  <div class="app-header">
    <div class="clearfix" style="width:1198px;margin:0 auto;">
      <div class="logo">
        <img src="../../assets/images/logo.png" alt />
      </div>
      <template v-if="isLogin">
        <div class="nav">
          <ul>
            <router-link
              tag="li"
              v-for="(item, index) in navMenu"
              :key="index"
              :to="item.url"
              active-class="active"
            >{{item.name}}</router-link>
          </ul>
        </div>

        <div class="tools">
          <ul>
            
            <li>
							管理员：小美
						</li>
            <li @click="editHandle">
              <i class="el-icon-switch-button"></i>
              退出
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navMenu: [
        {
          name: "商户管理",
          url: "/businessmanage"
        },
        {
          name: "市场运营",
          url: "/market"
        },
        {
          name: "销售运营",
          url: "/sales"
        },
        {
          name: "财务管理",
          url: "/finance"
        },
        {
          name: "系统管理",
          url: "/systemmanage"
        }
      ],
     
      isLogin: false
    };
  },
  mounted() {
    if (this.$api.getToken()) {
      console.log(this.$api.getToken());
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
  },
  methods: {
    editHandle() {
      this.$confirm("您即将退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api.deleteToken();
          window.location.href = "/";
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped>
.app-header {
  background: #fff;
  height: 68px;
  line-height: 68px;
  position: relative;
  z-index: 2;
}
.logo {
  width: 165px;
  height: 64px;
  float: left;
  margin-right: 20px;
}
.logo img {
  width: 100%;
  height: 100%;
  display: block; 
}
.nav {
  width: 660px;
  float: left;
  padding: 0 20px;
}
.nav ul {
  display: flex;
}
.nav li {
  font-size: 16px;
  color: #1c1c1c;
  padding: 0 30px;
  font-weight: 500;
  cursor: pointer;
}
.nav li.active {
  color: #44b549;
}
.tools {
  width: 300px;
  float: right;
  margin-right: 30px;
}
.tools ul {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.tools li {
  margin-left: 30px;
  font-size: 12px;
  color: #1c1c1c;
  cursor: pointer;
}
.tools li.active {
  color: #44b549;
}
.tools li i {
  font-size: 14px;
  margin-right: 3px;
}
.tools li span {
  color: #f76260;
}
</style>

 