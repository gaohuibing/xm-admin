<template>
  <div v-loading="loading">
    <div class="a-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/systemmanage/team/list/role' }">角色</el-breadcrumb-item>
        <el-breadcrumb-item>{{roleId?'编辑用户':'添加角色'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="formData" :rules="rules" ref="ruleForm">
      <div class="form-content" style="padding-top:60px">
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>角色名称：
          </div>
          <div>
            <el-form-item prop="role_name">
              <el-input
                type="text"
                v-model="formData.role_name"
                placeholder="请输入角色姓名"
                auto-complete="new-password"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>管理区域：
          </div>
          <div>
            <el-form-item prop="mobile">
              <el-input
                type="text"
                v-model="formData.region"
                placeholder="请输入"
                auto-complete="new-password"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="form-group" style="display:block">
          <div class="f-label">
            <span style="color:red">*</span>设置权限：
          </div>
          <div class="check-list">
            <div class="chexk-item">
              <div class="f-label">
                <span style="color:red"></span>商户管理
              </div>
              <div class="checks">
                <div>
                  <el-radio v-model="formData.merchant" label="1">查看</el-radio>
                  <el-radio v-model="formData.merchant" label="2">操作</el-radio>
                </div>
                <p>备注：管理区域，影响数据权限</p>
              </div>
            </div>
            <div class="chexk-item">
              <div class="f-label">
                <span style="color:red"></span>市场运营
              </div>
              <div class="checks">
                <div>
                  <el-radio v-model="formData.market" label="1">查看</el-radio>
                  <el-radio v-model="formData.market" label="2">操作</el-radio>
                </div>
                <p>备注：管理区域，影响数据权限</p>
              </div>
            </div>
            <div class="chexk-item">
              <div class="f-label">
                <span style="color:red"></span>营销运营
              </div>
              <div class="checks">
                <div>
                  <el-radio v-model="formData.marketing" label="1">查看</el-radio>
                  <el-radio v-model="formData.marketing" label="2">操作</el-radio>
                </div>
                <p>备注：管理区域，影响数据权限</p>
              </div>
            </div>
            <div class="chexk-item">
              <div class="f-label">
                <span style="color:red"></span>财务管理
              </div>
              <div class="checks">
                <div>
                  <el-radio v-model="formData.finance" label="1">查看</el-radio>
                  <el-radio v-model="formData.finance" label="2">操作</el-radio>
                </div>
                <p>备注：管理区域，不影响数据权限</p>
              </div>
            </div>
            <div class="chexk-item">
              <div class="f-label">
                <span style="color:red"></span>系统管理
              </div>
              <div class="checks">
                <div>
                  <el-radio v-model="formData.system" label="1">查看</el-radio>
                  <el-radio v-model="formData.system" label="2">操作</el-radio>
                </div>
                <p>备注：管理区域，不影响数据权限</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bot-tools-t">
        <el-button type="primary" @click="submit('ruleForm')">确定</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  mounted() {
    this.loadroleData();
  },
  data() {
    return {
      api_token: this.$api.getToken(),
      rules: {
        role_name: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          { max: 20, message: "长度不能超过20个字符", trigger: "blur" }
        ]
      },

      formData: {
        role_name: "",
        region: "0",
        merchant: "1",
        market: "1",
        marketing: "1",
        finance: "1",
        system: "1"
      },

      roleId: this.$route.query.id || "",
      loading: false
    };
  },
  methods: {
    loadroleData() {
      if (this.roleId) {
        this.loading = true;
        this.$api
          .get("system/get_role_details", {
            api_token: this.api_token,
            id: this.roleId
          })
          .then(res => {
            if (res.data.code == 200) {
              let resData = res.data.data;
              let keys = Object.keys(resData);
              keys.map(key => {
                resData[key] = resData[key] + "";
              });
              this.formData = resData;
            } else {
              this.$message.error({ message: res.data.msg });
            }
            this.loading = false;
          })
          .catch(err => {
            this.$message.error({ message: err });
          });
      }
    },

    //     提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.roleId) {
            // 编辑
            this.$api
              .post("system/edit_role", {
                ...this.formData,
                api_token: this.api_token,
                id: this.roleId
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  setTimeout(h => {
                    this.$router.go(-1);
                  }, 1000);
                } else {
                  this.$message.error({ message: res.data.msg });
                  this.loading = false;
                }
              })
              .catch(err => {
                this.$message.error({ message: err });
                this.loading = false;
              });
          } else {
            // 添加
            this.$api
              .post("system/add_role", {
                ...this.formData,
                api_token: this.api_token
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.$message({
                    message: "添加成功",
                    type: "success"
                  });
                  setTimeout(h => {
                    this.$router.go(-1);
                  }, 1000);
                } else {
                  this.$message.error({ message: res.data.msg });
                  this.loading = false;
                }
              })
              .catch(err => {
                this.$message.error({ message: err });
                this.loading = false;
              });
            // }
          }
        } else {
          this.$message.error("请将信息填写完整");
          this.loading = false;
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.form-group .el-input,
.form-group .el-cascader {
  width: 240px;
}
.check-list {
}
.chexk-item {
  padding-left: 30px;
  display: flex;
  margin-bottom: 20px;
}
.chexk-item p {
  font-size: 12px;
  color: #999;
}
</style>
