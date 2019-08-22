<template>
  <div v-loading="loading">
    <div class="a-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/systemmanage/team/list/user' }">用户</el-breadcrumb-item>
        <el-breadcrumb-item>{{userId?'编辑用户':'添加用户'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="formData" :rules="rules" ref="ruleForm">
      <div class="form-content" style="padding-top:60px">
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>用户姓名：
          </div>
          <div>
            <el-form-item prop="user_name">
              <el-input type="text" v-model="formData.user_name" placeholder="请输入用户姓名"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>设置账户：
          </div>
          <div>
            <el-form-item prop="mobile">
              <el-input
                type="text"
                v-model="formData.mobile"
                placeholder="请输入11位手机号"
                auto-complete="new-password"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>设置密码：
          </div>
          <div>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="formData.password"
                placeholder="请输入账户密码"
                :disabled="$route.query.id"
                show-password
                auto-complete="new-password"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>设置角色：
          </div>
          <el-form-item prop="role">
            <el-select v-model="formData.role" placeholder="请选择">
              <el-option
                v-for="(item) in roleLists"
                :key="item.id"
                :label="item.role_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <a
            @click.prevent="$router.push('/systemmanage/team/role_form')"
            style="color:#69c46d;margin-left:5px"
          >新建</a>
        </div>
      </div>

      <div class="bot-tools-t">
        <el-button type="primary" @click="submit('ruleForm')">确定</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
    </el-form>
    <!-- <el-dialog
      :visible.sync="submitVisible"
      title="商户添加成功"
      width="30%"
      class="submitDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div style="display:flex;align-items:center">
        <i class="el-icon-success" style="color:#44B549;font-size:20px;margin-right:6px"></i>
        商户添加成功，你可以进行以下快捷操作
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toDetails" size="small">查看商户详情</el-button>
        <el-button @click="addMore" size="small">继续新增</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>
<script>
export default {
  mounted() {
    this.loadRoles();
  },
  data() {
    return {
      api_token: this.$api.getToken(),
      rules: {
        user_name: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          { max: 20, message: "长度不能超过20个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { max: 11, message: "长度不能超过11个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "change" }]
      },

      formData: {
        user_name: "",
        mobile: "",
        password: "",
        city: "",
        role: ""
      },
      roleLists: [],
      userId: this.$route.query.id || "",
      loading: false
    };
  },
  methods: {
    loadUserData() {
      if (this.userId) {
        this.$api
          .get("system/get_user_details", {
            api_token: this.api_token,
            id: this.userId
          })
          .then(res => {
            if (res.data.code == 200) {
              this.formData = res.data.data;
            } else {
              this.$message.error({ message: res.data.msg });
            }
          })
          .catch(err => {
            this.$message.error({ message: err });
          });
      }
    },
    // 角色列表 id name 键值对
    loadRoles() {
      this.$api
        .get("system/get_role", {
          api_token: this.api_token
        })
        .then(res => {
          if (res.data.code == 200) {
            this.roleLists = res.data.data;
            this.loadUserData();
          } else {
            this.$message.error({ message: res.data.msg });
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    // 新建角色
    addRole() {},
    //     提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.userId) {
            // 编辑
            this.$api
              .post("system/edit_user", {
                ...this.formData,
                api_token: this.api_token,
                id: this.userId
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
              .post("system/add_user", {
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
</style>
