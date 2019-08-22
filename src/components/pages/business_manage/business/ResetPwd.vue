<template>
  <div>
    <el-dialog :visible.sync="currentVisible" width="30%" class="submitDialog">
      <div style="padding:50px 0;line-height:1.4;text-align:center;font-size:16px">
        确认重置商户登录密码？
        <br />默认重置密码：123456
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetPwd" size="small">确认</el-button>
        <el-button @click="currentVisible=false" size="small">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["pwdVisible", "userId"],
  mounted() {},
  data() {
    return {
      currentVisible: false,     
    };
  },
  methods: {
    // 重置密码
    resetPwd() {
      this.$api
        .get("enterprise/change_password", {
          api_token: this.$api.getToken(),
          user_id: this.userId
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "重置密码成功",
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
    pwdVisible(value) {
      this.currentVisible = value;
    },
    currentVisible(value) {
      this.$emit("update:pwdVisible", value);
    }
  }
};
</script>

<style scoped>
</style>