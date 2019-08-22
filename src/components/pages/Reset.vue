<template>
  <div>
    <app-header></app-header>
    <div class="login-main">
      <div class="left-normal">
        <img src="../../assets/images/login-pic.png" alt />
        <p>让个体成为平台&nbsp;&nbsp;&nbsp;&nbsp;用平台成就个体</p>
      </div>
      <div class="right-main">
        <div class="title">重置密码</div>
        <div class="login">
          <form>
            <div class="login-item" :class="{'active':!isMobile}">
              <img src="../../assets/images/user.png" alt class="x-icon" />
              <el-input v-model="mobile" placeholder="请输入手机号" @blur="mobileBlur"></el-input>
              <span class="tip">{{mobileText}}</span>
            </div>
            <div class="login-item" :class="{'active':!isCaptcha}">
              <img src="../../assets/images/code.png" alt class="x-icon" />
              <el-input placeholder="请输入验证码" v-model="code" style="width:140px" @blur="captchaBlur"></el-input>
              <div
                class="getcode"
                @click="getCode"
                :style="{'color':isGet?'#ddd':'','border-color':isGet?'#ddd':''}"
              >{{codeBtn}}</div>
              <span class="tip">{{captchaText}}</span>
            </div>
            <div class="login-item" :class="{'active':!isPassword}">
              <img src="../../assets/images/pwd.png" alt class="x-icon" />
              <el-input
                placeholder="请输入密码"
                v-model="new_pwd"
                show-password
                @blur="passwordBlur"
                auto-complete="new-password"
              ></el-input>
              <span class="tip">{{passwordText}}</span>
            </div>
            <div class="login-item" :class="{'active':!isRepassword}">
              <img src="../../assets/images/pwd.png" alt class="x-icon" />
              <el-input
                placeholder="确认密码"
                v-model="re_pwd"
                show-password
                @blur="repasswordBlur"
                auto-complete="new-password"
              ></el-input>
              <span class="tip">{{repasswordText}}</span>
            </div>
            <div class style="margin-top:13px">
              <el-button
                type="primary"
                size="small"
                style="width:100%;font-size:16px"
                @click="resetPwd"
              >重置密码</el-button>
            </div>
            <div class="login-tools">         
              <span class="findpwd" @click="goLogin">返回登录</span>
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
    
  },
  data() {
    return {
      codeBtn: "获取验证码",
      isGet: false,
      codeTime: 60,
      input: "",
      checked: true,
      mobile: store.get("username") || "",
      new_pwd: "",
      re_pwd: "",
      code: "",
      // 验证相关
      isMobile: true,
      mobileText: "",
      isPassword: true,
      passwordText: "",
      isRepassword: true,
      repasswordText: "",
      isCaptcha: true,
      captchaText: ""
    };
  },
  methods: {
    // 获取验证码
    getCode() {
      if (!this.mobileBlur()) {
        return false;
      }
      if (this.isGet) {
        return false;
      }
      this.$api
        .post("admin/send_code_pwd", {
          mobile: this.mobile
        })
        .then(res => {
          if (res.data.code == 200) {
            this.codeBtn = `${this.codeTime}s`;
            this.isGet = true;

            let timer = setInterval(h => {
              this.codeBtn = `${this.codeTime - 1}s`;
              this.codeTime--;
              if (this.codeTime <= 0) {
                clearInterval(timer);
                this.isGet = false;
                this.codeBtn = "重新获取";
              }
            }, 1000);
          } else {
            this.$message.error({ message: res.data.msg });
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    // 重置密码
    resetPwd() {
      if (
        this.mobileBlur() &&
        this.passwordBlur() &&
        this.repasswordBlur() &&
        this.captchaBlur()
      ) {
        this.$api
          .post("admin/reset_pwd", {
            mobile: this.mobile,
            new_pwd: this.new_pwd,
            re_pwd: this.re_pwd,
            code: this.code
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: "重置密码成功，请登录",
                type: "success"
              });
              setTimeout(h => {
                this.goLogin();
              }, 1000);
            } else {
              this.$message.error({ message: res.data.msg });
            }
          })
          .catch(err => {
            this.$message.error({ message: err });
          });
      }
    },
    goLogin() {
      this.$router.replace('./login')
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
      if (this.new_pwd == "") {
        this.isPassword = false;
        this.passwordText = "请输入密码";
        return false;
      } else {
        this.isPassword = true;
        this.passwordText = "";
        return true;
      }
    },
    repasswordBlur() {
      if (this.new_pwd == "") {
        this.isRepassword = false;
        this.repasswordText = "请重复密码";
        return false;
      } else if (this.new_pwd != this.re_pwd) {
        this.isRepassword = false;
        this.repasswordText = "密码不一致";
        return false;
      } else {
        this.isRepassword = true;
        this.repasswordText = "";
        return true;
      }
    },
    captchaBlur() {
      if (this.code == "") {
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
 