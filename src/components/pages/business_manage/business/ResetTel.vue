<template>
  <div>
    <!-- 审核不通过弹窗 -->
    <el-dialog :visible.sync="currentVisible" width="30%" class="submitDialog">
      <div class="form-content">
        <div class="form-group">
          <div class="f-label">原登录手机号：</div>
          <div>{{tel}}</div>
        </div>
        <div class="form-group">
          <div class="f-label">新登录手机号：</div>
          <div style="width:224px">
            <el-input type="text" v-model="mobile" placeholder="请输入手机号"></el-input>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">短信验证码：</div>
          <div class="codebox">
            <el-input type="text" v-model="code" placeholder="请输入验证码" style="width:140px"></el-input>
            <div
              class="getcode"
              @click="getCode"
              :style="{'color':isGet?'#fff':'','background-color':isGet?'#ccc':'',}"
            >{{codeBtn}}</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetMobile" size="small">确认</el-button>
        <el-button @click="currentVisible=false" size="small">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["telVisible", "tel", "userId"],
  mounted() {
    console.log(this.tel);
  },
  data() {
    return {
      codeBtn: "获取验证码",
      isGet: false,
      codeTime: 60,
      currentVisible: false,
      // 新手机号码
      mobile: "",
      code: ""
    };
  },
  methods: {
    // 获取验证码
    getCode() {
      if (!this.mobile) {
        this.$message.error("请输入新手机号");
        return false;
      }
      if (this.isGet) {
        return false;
      }
      this.$api
        .get("enterprise/send_code_mobile", {
          api_token: this.$api.getToken(),
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
    // 重置手机号
    resetMobile() {
      if (!this.mobile) {
        this.$message.error("请填写新手机号");
        return false;
      }
      if (!this.code) {
        this.$message.error("请填写验证码");
        return false;
      }
      this.$api
        .get("enterprise/change_mobile", {
          api_token: this.$api.getToken(),
          mobile: this.mobile,
          user_id: this.userId,
          code: this.code
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "手机号更换成功",
              type: "success"
            });
            this.currentVisible = false;
            this.$bus.$emit("upload:loadMerchantDetails");
          } else {
            this.$message.error({ message: res.data.msg });
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    }
  },
  watch: {
    telVisible(value) {
      this.currentVisible = value;
      this.mobile = "";
      this.code = "";
    },
    currentVisible(value) {
      this.$emit("update:telVisible", value);
    }
  }
};
</script>

<style scoped>
.codebox {
  display: flex;
  flex-shrink: 1;
  width: 224px;
  justify-content: space-between;
}
.codebox .getcode {
  width: 80px;
  height: 32px;
  color: #fff;
  text-align: center;
  line-height: 32px;
  border-radius: 3px;
  background: #44b549;
  cursor: pointer;
}
</style>