<template>
  <div>
    <div class="a-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/businessmanage/business/profile' }">商户概况</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/businessmanage/business/detail?id=1'}">商户详情</el-breadcrumb-item>
        <el-breadcrumb-item>编辑企业信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="certi-content certi-form" v-loading="loading">
      <el-form :model="formData" :rules="rules" ref="ruleForm">
        <div class="line-2">
          <span>
            <i>*</i>企业名称
          </span>
          <el-form-item prop="enterprise">
            <el-input placeholder="请输入企业名称" v-model="formData.enterprise"></el-input>
          </el-form-item>
        </div>
        <div class="line-2">
          <span>
            <i>*</i>注册号
          </span>
          <el-form-item prop="reg_num">
            <el-input placeholder="请输入注册号" v-model="formData.reg_num"></el-input>
          </el-form-item>
        </div>
        <div class="line-2">
          <span>
            <i>*</i>所在地区
          </span>
          <el-form-item prop="province">
            <el-cascader
              :options="options"
              placeholder="省/市/区"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </div>
        <div class="line-2">
          <span>
            <i>*</i>详细地址
          </span>
          <el-form-item prop="address">
            <el-input placeholder="请输入详细地址" v-model="formData.address"></el-input>
          </el-form-item>
        </div>
        <div class="line-2">
          <span>
            <i>*</i>联系人
          </span>
          <el-form-item prop="contacts">
            <el-input placeholder="请输入联系人" v-model="formData.contacts"></el-input>
          </el-form-item>
        </div>
        <div class="line-2">
          <span>
            <i>*</i>联系电话
          </span>
          <el-form-item prop="mobile">
            <el-input placeholder="请输入联系电话" v-model="formData.mobile"></el-input>
          </el-form-item>
        </div>
        <div class="line-2">
          <span>
            <i>*</i>营业执照
          </span>
          <div class="upload-wrap">
            <div v-if="formData.license">
              <img :src="formData.license" alt />
              <p class="tips">营业执照</p>
            </div>
            <div v-else>
              <img src="../../../../assets/images/Bitmap.png" alt />
              <p class="tips">照片示例</p>
            </div>
            <div class="upload-box">
              <el-upload
                class="upload-demo"
                :action="apiUrl"
                :data="{api_token:$api.getToken(),type:'license'}"
                multiple
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :on-error="uploadError"
              >
                <el-button size="small" type="primary">上传照片</el-button>
              </el-upload>
              <p>必须为彩色图片且小于2M，文件格式为bmp、png、jpeg、jpg或gif</p>
            </div>
          </div>
        </div>
        <div class="line-2">
          <span>企业logo</span>
          <div class="upload-wrap">
            <div v-if="formData.logo">
              <img :src="formData.logo" alt />
              <p class="tips">企业logo</p>
            </div>
            <div v-else>
              <img src="../../../../assets/images/Bitmap.png" alt />
              <p class="tips">照片示例</p>
            </div>
            <div class="upload-box">
              <el-upload
                class="upload-demo"
                :action="apiUrl"
                :data="{api_token:$api.getToken(),type:'logo'}"
                multiple
                :show-file-list="false"
                :before-upload="beforeUploadLogo"
                :on-success="uploadSuccessLogo"
                :on-error="uploadErrorLogo"
              >
                <el-button size="small" type="primary">上传照片</el-button>
              </el-upload>
              <p>必须为彩色图片且小于2M，文件格式为bmp、png、jpeg、jpg或gif</p>
            </div>
          </div>
        </div>
      </el-form>
      <div class="bot-tools-t" style="position:static">
        <template>
          <el-button type="primary" size="small" @click="submitHandle('ruleForm')">保存</el-button>
          <el-button size="small" @click="$router.go(-1)">取消</el-button>
        </template>
      </div>
    </div>

    <!-- 提交成功后弹窗 -->
    <el-dialog :visible.sync="submitVisible" width="30%" class="submitDialog">
      <div
        style="display:flex;align-items:center;justify-content: space-between;flex-direction: column"
      >
        <i class="el-icon-success" style="color:#44B549;font-size:80px;margin-bottom:10px"></i>
        <span>已提交企业认证审核！</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitVisible=false" size="small">确认</el-button>
        <el-button @click="submitVisible=false;$router.push('/service/list')" size="small">返回服务中心</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { regionData } from "element-china-area-data";
export default {
  data() {
    return {
      apiUrl: this.$api.apiUrl + "enterprise/upload_enterprise_img",
      rules: {
        enterprise: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ],
        reg_num: [{ required: true, message: "请输入注册号", trigger: "blur" }],
        province: [
          { required: true, message: "请选择地区", trigger: "change" }
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        contacts: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        mobile: [{ required: true, message: "请输入联系电话", trigger: "blur" }]
      },
      formData: {
        enterprise: "",
        reg_num: "",
        province: "",
        city: "",
        county: "",
        address: "",
        contacts: "",
        mobile: "",
        license: "",
        logo: ""
      },
      options: regionData,
      selectedOptions: [],
      loading: false,
      submitVisible: false
    };
  },
  mounted() {
    this.getEnterprise();
  },
  methods: {
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
      this.formData.license = response.data;
      this.loading = false;
    },
    uploadError() {
      this.loading = false;
    },

    beforeUploadLogo(file) {
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
    uploadSuccessLogo(response, file, fileList) {
      this.formData.logo = response.data;
      this.loading = false;
    },
    uploadErrorLogo() {
      this.loading = false;
    },
    handleChange(e) {
      this.formData.province = this.selectedOptions[0];
      this.formData.city = this.selectedOptions[1];
      this.formData.county = this.selectedOptions[2];
    },
    // 获取企业认证数据
    getEnterprise() {
      this.loading = true;
      this.$api
        .get("enterprise/get_merchant_info", {
          api_token: this.$api.getToken(),
          user_id: this.$route.query.id
        })
        .then(res => {
          if (res.data.code == 200) {
            this.formData = res.data.data;
            this.selectedOptions = [
              res.data.data.province + "",
              this.formData.city + "",
              this.formData.county + ""
            ];
          } else {
            this.$message.error({ message: res.data.msg });
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message.error({ message: err });
          this.loading = false;
        });
    },
    // 保存
    submitHandle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.formData.license) {
            this.$message.error("请上传营业执照");
            return false;
          }
          this.$api
            .post("enterprise/edit_merchant", {
              ...this.formData,
              user_id: this.$route.query.id,
              api_token: this.$api.getToken()
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$message({
                  message: "编辑成功",
                  type: "success"
		    });
		    setTimeout(h=>{this.$router.go(-1)},500)
              } else {
                this.$message.error({ message: res.data.msg });
              }
            })
            .catch(err => {
              this.$message.error({ message: err });
            });
        } else {
          this.loading = false;
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.certi-main {
  padding: 0 125px;
  overflow: hidden;
}
.certi-main .certi-tit {
  font-size: 18px;
  padding: 15px 15px 10px 15px;
  border-bottom: 1px solid #e8e8e8;
}
.certi-status {
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  background: rgba(68, 181, 73, 0.26);
}
.certi-status i {
  color: #09bb07;
}
.certi-status.dsl {
  background: #fffbe6;
}
.certi-status.dsl i {
  color: #faad14;
}
.certi-content {
  padding: 12px 0;
  padding-bottom: 110px;
}
.certi-content .line-1 {
  display: flex;
  margin-bottom: 30px;
  font-size: 16px;
}
.certi-content .line-1 span {
  margin-right: 72px;
}
.certi-content .line-2 {
  display: flex;
  margin-bottom: 20px;
  padding-left: 200px;
  flex-shrink: 1;
  font-size: 14px;
  line-height: 40px;
}
.certi-content .line-2 > span {
  width: 80px;
  text-align: right;
  margin-right: 30px;
}
.certi-content .line-2 > span i {
  color: #ed5580;
  font-style: normal;
  margin-right: 4px;
}
.certi-content .line-2 > div {
  width: 300px;
}
.upload-wrap {
  width: auto;
  flex-grow: 1;
  display: flex;
  align-items: center;
}
.upload-wrap img {
  width: 140px;
}
.upload-box {
  margin-left: 60px;
}
.certi-content .line-2 > div p {
  color: #666;
  margin-top: 8px;
}
.tips {
  width: 140px;
  text-align: center;
  margin-top: 0 !important;
}
</style>
