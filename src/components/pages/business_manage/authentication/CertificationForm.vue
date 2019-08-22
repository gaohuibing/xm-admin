<template>
  <div class="service-wrap">
    <div class="service-tit">
      <span>
        企业认证审核
        <i>/ {{review_status==1?'待审核详情':review_status==2?'已认证详情':'未通过详情'}}</i>
      </span>
    </div>
    <div class="certi-main" v-loading="loading">
      <div class="certi-status" :class="review_status==3?'btg':review_status==1?'dsl':''">
        <i class="el-icon-warning"></i>
        {{CERT[review_status]}}
      </div>

      <div class="certi-content">
        <div class="line-1">
          <span>订单编号：</span>
          <span>申请时间：{{$moment(formData.created_at*1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
          <span>审核时间：{{formData.submit_at?$moment(formData.submit_at*1000).format('YYYY-MM-DD HH:mm:ss'):'-'}}</span>
        </div>
        <div class="line-2">
          <span>企业名称：</span>
          {{formData.enterprise}}
        </div>
        <div class="line-2">
          <span>注册号：</span>
          {{formData.enterprise}}
        </div>
        <div class="line-2">
          <span>所在地区：</span>
          <!-- {{formData.enterprise}} -->
          {{$common.regionFormat(`${formData.province}-${formData.city}-${formData.county}`)}}
        </div>
        <div class="line-2">
          <span>详细地址：</span>
          {{formData.address}}
        </div>
        <div class="line-2">
          <span>联系人：</span>
          {{formData.contacts}}
        </div>
        <div class="line-2">
          <span>联系电话：</span>
          {{formData.mobile}}
        </div>
        <div class="line-2">
          <span>营业执照：</span>
          <div>
            <img :src="formData.license" alt />
            <p>营业执照</p>
          </div>
        </div>
        <div class="line-2" v-if="formData.logo">
          <span>企业logo：</span>
          <div>
            <img :src="formData.logo" alt />
          </div>
        </div>
      </div>

      <div class="bot-tools-t" style="position:static">
        <template v-if="review_status==1">
          <el-button type="primary" size="small" @click="pass">审核通过</el-button>
          <el-button size="small" @click="submit1Visible=true">审核不通过</el-button>
        </template>
      </div>
    </div>

    <!-- 提交成功后弹窗 -->
    <el-dialog :visible.sync="submitVisible" width="30%" class="submitDialog">
      <div
        style="display:flex;align-items:center;justify-content: space-between;flex-direction: column"
      >
        <i class="el-icon-success" style="color:#44B549;font-size:80px;margin-bottom:10px"></i>
        <span>企业已通过审核！</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="$router.push({path:'/businessmanage/business/detail',query:{id:$route.query.id}})"
          size="small"
        >确认</el-button>
        <el-button
          @click="submitVisible=false;$router.push({path:'/businessmanage/business/detail',query:{id:$route.query.id}})"
          size="small"
        >返回商户详情</el-button>
      </span>
    </el-dialog>
    <!-- 审核不通过弹窗 -->
    <el-dialog :visible.sync="submit1Visible" width="30%" title="审核不通过原因？" class="submitDialog">
      <div class="form-content">
        <div class="form-group">
          <div class="f-label">不通过原因：</div>
          <div>
            <el-select v-model="reasonType" placeholder="请选择">
              <el-option v-for="(item,key) in reasonData" :key="key" :label="item" :value="key"></el-option>
            </el-select>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">其他原因：</div>
          <div>
            <el-input
              type="textarea"
              v-model="otherReason"
              placeholder="请输入不通过原因"
              :disabled="reasonType!=10"
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="notPass" size="small">确认</el-button>
        <el-button @click="submit1Visible=false" size="small">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { regionData } from "element-china-area-data";
import CERT from "../../../../assets/CERT";
const reasonData = {
  2: "企业名称与营业执照不一致",
  3: "注册号与营业执照不一致",
  4: "详细地址无效",
  5: "联系电话无效",
  6: "营业执照无效",
  10: "其他"
};
export default {
  mounted() {
    this.getEnterprise();
  },
  data() {
    return {
      CERT: CERT,
      reasonData: reasonData,
      reasonType: "",
      otherReason: "",
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

      loading: false,
      submitVisible: false,
      submit1Visible: false,
      isShow: 0, // 0 详情  // 1 表单
      review_status: "",
      reason: ""
    };
  },
  methods: {
    // 获取企业认证数据
    getEnterprise() {
      this.loading = true;
      this.$api
        .get("enterprise/review_details", {
          api_token: this.$api.getToken(),
          user_id: this.$route.query.id
        })
        .then(res => {
          if (res.data.code == 200) {
            this.formData = res.data.data;

            this.review_status = this.formData.review_status;
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
    // s审核通过
    pass() {
      this.$api
        .post("enterprise/review_enterprise", {
          api_token: this.$api.getToken(),
          user_id: this.$route.query.id,
          review_status: 2
        })
        .then(res => {
          if (res.data.code == 200) {
            this.submitVisible = true;
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
    // s审核不通过
    notPass() {
      let reason = "";
      if (this.reasonType != 10) {
        reason = this.reasonData[this.reasonType];
      } else {
        reason = this.otherReason;
	}
	if(!reason){
		this.$message.error('请选择不通过原因')
		return
	}
      this.$api
        .post("enterprise/review_enterprise", {
          api_token: this.$api.getToken(),
          user_id: this.$route.query.id,
          review_status: 3,
          fail_reason: reason
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$router.push({
              path: "/businessmanage/business/detail",
              query: { id: this.$route.query.id }
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
    }
  }
};
</script>

<style scoped>
.certi-main {
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
  text-align: center;
}
.certi-status i {
  color: #09bb07;
}
.certi-status.dsl {
  background: rgba(68, 181, 73, 0.3);
}
.certi-status.btg {
  background: rgba(209, 209, 209, 1);
}
.certi-status.btg i {
  color: #ee7471;
}
.certi-status.dsl i {
  color: #fc8787;
}
.certi-content {
  padding: 12px 20px;
  padding-bottom: 110px;
}
.certi-content .line-1 {
  display: flex;
  margin-bottom: 30px;
  font-size: 16px;
  color: #333;
}
.certi-content .line-1 span {
  margin-right: 72px;
}
.certi-content .line-2 {
  display: flex;
  margin-bottom: 20px;

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
  color: #09bb07;
  margin-top: 8px;
}
.tips {
  width: 140px;
  text-align: center;
  margin-top: 0 !important;
}
</style>
