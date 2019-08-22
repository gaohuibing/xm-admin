<template>
  <div>
    <app-header></app-header>
    <div class="login-main">
      <div class="left-normal">
        <img src="../../assets/images/login-pic.png" alt />
        <p>让个体成为平台&nbsp;&nbsp;&nbsp;&nbsp;用平台成就个体</p>
      </div>
      <div class="right-main">
        <div class="title">管理端登录</div>
        <div class="login">
          <form>
            <div class="login-item" :class="{'active':!isMobile}">
              <img src="../../assets/images/user.png" alt class="x-icon" />
              <el-input v-model="mobile" placeholder="请输入手机号" @blur="mobileBlur"></el-input>
              <span class="tip">{{mobileText}}</span>
            </div>
            <div class="login-item" :class="{'active':!isPassword}">
              <img src="../../assets/images/pwd.png" alt class="x-icon" />
              <el-input placeholder="请输入密码" v-model="password" show-password @blur="passwordBlur"></el-input>
              <span class="tip">{{passwordText}}</span>
            </div>
            <div class="login-item" :class="{'active':!isCaptcha}">
              <img src="../../assets/images/code.png" alt class="x-icon" />
              <el-input
                placeholder="请输入验证码"
                v-model="captcha"
                style="width:140px"
                @blur="captchaBlur"
              ></el-input>
              <div class="getcode" @click="getImgCode">
                <img :src="imgCode" alt style="width:100%;height:100%" />
              </div>

              <span class="tip">{{captchaText}}</span>
            </div>
            <div style="padding:0 0 20px 5px">
              <el-checkbox v-model="checked">记住账号</el-checkbox>
            </div>

            <div class>
              <el-button
                type="primary"
                size="small"
                style="width:100%;font-size:16px"
                @click="login"
              >登录</el-button>
            </div>
            <div class="login-tools">
              <span class="findpwd"></span>
              <span class="findpwd" @click="findPwd">忘记密码？</span>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="s-footer">
      <p>
        2017 &#169; 小美网（苏州）网络信息科技有限公司 版权所有 Copyright &#169; 2017-2019 Xiaomei. All Rights Reserved.
        <a
          href="
http://www.beian.miit.gov.cn/state/outPortal/loginPortal.action;jsessionid=Z-JEYbBYGAGHOD2D9DU5DuZRoavPKb4tR0nsxi0c5Rx8t2k-ZyLO!285674180
"
          style="color:#929292"
        >苏ICP备17067525号-2</a>
      </p>
    </div>
  </div>
</template>
 <script>
let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
import AppHeader from "@/components/common/header";

export default {
  components: { AppHeader },
  mounted() {
    this.getImgCode();
  },
  data() {
    return {
      mobile: store.get("username") || "",
      password: "",
      captcha: "",
      checked: true,
      imgCode: "",
      key: "",
      // 验证相关
      isMobile: true,
      mobileText: "",
      isPassword: true,
      passwordText: "",
      isCaptcha: true,
      captchaText: ""
    };
  },
  methods: {
   
    //获取图形验证码
    getImgCode() {
      this.$api
        .get("admin/captcha")
        .then(res => {
          if (res.data.code == 200) {
            this.imgCode = res.data.url.img;
            this.key = res.data.url.key;
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    login() {
      if (this.mobileBlur() && this.passwordBlur() && this.captchaBlur()) {
        this.$api
          .post("admin/admin_login", {
            mobile: this.mobile,
            password: this.password,
            captcha: this.captcha,
            key: this.key
          })
          .then(res => {
            if (res.data.code == 200) {
              let token = res.data.token;
              if (!token) {
                this.$message.error({ message: "没有返回token" });
                return false;
              }
              this.$api.setToken(token);
              if (this.checked) {
                store.set("username", this.mobile);
              }
              this.getUserInfo(token);
            } else {
              this.$message.error({ message: res.data.msg });
            }
          })
          .catch(err => {
            this.$message.error({ message: err });
          });
      } else {
        return false;
      }
    },
    getUserInfo(token) {
      this.$api
        .get("admin/get_admin", {
          api_token: token
        })
        .then(res => {
          if (res.data.code == 200) {
            let userInfo = res.data.data;
            store.set("userInfo", userInfo);
            setTimeout(h => {
              window.location.href = "/";
            });
          } else {
            this.$message.error({ message: res.data.msg });
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    // 找回密码
    findPwd() {
      this.$router.push('./reset');
    },
    mobileBlur() {
      if (this.mobile == "") {
        this.isMobile = false;
        this.mobileText = "请输入手机号";
        return false;
      } else if (this.mobile.match(reg) == null) {
        this.isMobile = false;
        this.mobileText = "手机号格式错误";
        return false;
      } else {
        this.isMobile = true;
        this.mobileText = "";
        return true;
      }
    },
    passwordBlur() {
      if (this.password == "") {
        this.isPassword = false;
        this.passwordText = "请输入密码";
        return false;
      } else {
        this.isPassword = true;
        this.passwordText = "";
        return true;
      }
    },
    captchaBlur() {
      if (this.captcha == "") {
        this.isCaptcha = false;
        this.captchaText = "请输入验证码";
        return false;
      } else {
        this.isCaptcha = true;
        this.captchaText = "";
        return true;
      }
    }
  },
  watch: {}
};
</script>
 <style scoped>
.login-main {
  position: absolute;
  top: 88px;
  left: 50%;
  margin-left: -600px;
  bottom: 60px;
  width: 1200px;
  display: flex;
  flex-shrink: 1;
  background: #fff;
  border: 1px solid rgba(231, 231, 235, 1);
  align-items: center;
}
.left-normal {
  flex-grow: 1;
  text-align: center;
}
.left-normal p {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-top: 80px;
}
.right-main {
  width: 400px;
  box-shadow: 0px 2px 20px rgba(150, 193, 152, 0.19);
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 80px;
  padding: 60px;
}
.right-main .title {
  font-size: 32px;
  color: #44b549;
  text-align: center;
  margin-bottom: 40px;
}
.s-footer {
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: -600px;
  width: 1200px;
}
.s-footer .about {
  height: 37px;
  border-bottom: 1px solid rgba(232, 232, 236, 1);
  line-height: 36px;
  color: #929292;
  font-size: 12px;
}
.s-footer .about a {
  color: #929292;
  font-size: 12px;
  padding-right: 12px;
}
.s-footer p {
  color: #929292;
  font-size: 12px;
  padding: 10px 0 30px 0;
}

.login-tools {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.findpwd {
  color: #999999;
  cursor: pointer;
}
</style>
 