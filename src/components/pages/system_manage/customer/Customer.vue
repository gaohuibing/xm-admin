<template>
  <div v-loading="loading">
    <div class="a-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>客服消息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="formData" :rules="rules" ref="ruleForm">
      <div class="form-content" style="padding-top:60px">
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>客服电话：
          </div>
          <div>
            <el-form-item prop="telephone">
              <el-input type="text" v-model="formData.telephone" placeholder="请输入客服电话"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>客服QQ：
          </div>
          <div>
            <el-form-item prop="qq">
              <el-input type="text" v-model="formData.qq" placeholder="请输入客服QQ"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>客服微信：
          </div>
          <div>
            <el-form-item prop="wechat">
              <el-input
                type="text"
                v-model="formData.wechat"
                placeholder="请输入客服微信"
                auto-complete="new-password"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-group" style="align-items:flex-start">
          <div class="f-label">
            <span style="color:red">*</span>客服二维码：
          </div>
          <el-form-item prop="qr_code">
            <el-upload
              class="avatar-uploader"
              :action="apiUrl"
              :data="{api_token:$api.getToken(),type:'logo'}"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :before-upload="beforeUpload"
            >
              <img v-if="formData.qr_code" :src="formData.qr_code" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
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
    this.loadcustomer();
  },
  data() {
    return {
      apiUrl: this.$api.apiUrl + "system/upload_customer_img",
      api_token: this.$api.getToken(),
      rules: {
        qq: [{ required: true, message: "请输入客服QQ", trigger: "blur" }],
        telephone: [
          { required: true, message: "请输入客服手机号", trigger: "blur" }
        ],
        wechat: [
          { required: true, message: "请输入客服微信", trigger: "blur" }
        ],
        qr_code: [{ required: true, message: "请上传二维码", trigger: "blur" }]
      },

      formData: {
        telephone: "",
        qq: "",
        wechat: "",
        qr_code: ""
      },
      imageUrl: "",
      loading: false
    };
  },
  methods: {
    loadcustomer() {
      this.$api
        .get("system/get_customer_service", {
          api_token: this.api_token
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
    },

    //     提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.formData.qr_code) {
            this.$message.error("请上传客服二维码");
            return false;
          }
          this.loading = true;

          this.$api
            .post("system/edit_customer_service", {
              ...this.formData,
              api_token: this.api_token,
              id: 1
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                this.$message.error({ message: res.data.msg });
              }
              this.loading = false;
            })
            .catch(err => {
              this.$message.error({ message: err });
              this.loading = false;
            });
        } else {
          this.$message.error("请将信息填写完整");
          this.loading = false;
          return false;
        }
      });
    },
    beforeUpload(file) {
      this.loading = true;
      let _this = this;
      if (file.type.indexOf("image") < 0) {
        _this.$message({ message: "图片格式不正确", type: "error" });
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传的图片尺寸不能超过2M");
        return false;
      }
      return true;
    },
    uploadSuccess(response, file, fileList) {
      this.formData.qr_code = response.data;
      this.loading = false;
    }
  }
};
</script>
<style scoped>
.form-group .el-input,
.form-group .el-cascader {
  width: 240px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
