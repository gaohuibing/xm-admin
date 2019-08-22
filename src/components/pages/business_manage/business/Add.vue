<template>
  <div v-loading="loading">
    <div class="a-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/businessmanage/business/profile' }">商户概况</el-breadcrumb-item>
        <el-breadcrumb-item>新增商户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form-content" style="padding-top:60px">
      <el-form :model="formData" :rules="rules" ref="ruleForm">
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>登录账户：
          </div>
          <div>
            <el-form-item prop="mobile">
              <el-input
                type="text"
                v-model="formData.mobile"
                placeholder="请输入手机号"
                auto-complete="new-password"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>登录密码：
          </div>
          <div>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="formData.password"
                placeholder="请设置6—12位密码，包含数字和字母"
                auto-complete="new-password"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>公司名称：
          </div>
          <div>
            <el-form-item prop="enterprise">
              <el-input type="text" v-model="formData.enterprise" placeholder="请输入公司名称"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>所在地：
          </div>
          <div>
            <el-form-item prop="province">
              <el-cascader
                :options="options"
                placeholder="请选择地区"
                v-model="selectedOptions"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <div class="bot-tools-t">
      <el-button type="primary" @click="addMerchant('ruleForm')">确定</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>
    <el-dialog
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
    </el-dialog>
  </div>
</template>
<script>
import { regionData } from "element-china-area-data";
export default {
  data() {
    return {
      api_token: this.$api.getToken(),
      pwd: "",
      options: regionData,
      formData: {
        mobile: "",
        password: "",
        enterprise: "",
        province: "",
        city: "",
        county: ""
      },
      rules: {
        mobile: [
          { required: true, message: "请请输入手机号", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        enterprise: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        province: [
          { required: true, message: "请选择所在地", trigger: "change" }
        ]
      },
      selectedOptions: [],
      submitVisible: false,
      loading: false,
      addId: undefined
    };
  },
  methods: {
    handleChange(e) {
      this.formData.province = this.selectedOptions[0];
      this.formData.city = this.selectedOptions[1];
      this.formData.county = this.selectedOptions[2];
    },
    addMerchant(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api
            .post("enterprise/add_merchant", {
              api_token: this.api_token,
              ...this.formData
            })
            .then(res => {
              if (res.data.code == 200) {
                this.submitVisible = true;
                let id = res.data.data;
                this.addId = id;
              } else {
                this.$message.error({ message: res.data.msg });
              }
            })
            .catch(err => {
              this.$message.error({ message: err });
            });
        } else {
          this.$message.error("请将信息填写完整");
          return false;
        }
      });
    },
    // 跳转详情
    toDetails() {
      if (this.addId) {
        this.$router.push({
          path: "./detail",
          query: {
            id: this.addId
          }
        });
      }
    },
    // 继续新增
    addMore() {
      this.addId = undefined;
      this.formData = {
        mobile: "",
        password: "",
        enterprise: "",
        province: "",
        city: "",
        county: ""
      };
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
