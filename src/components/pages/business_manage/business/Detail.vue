<template>
  <div style="padding-bottom:20px" v-loading="loading">
    <div class="a-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/businessmanage/business/profile' }">商户概况</el-breadcrumb-item>
        <el-breadcrumb-item>商户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-1">
      <ul>
        <li>
          <div>{{merchantInfo.enterprise}}</div>
          <div>
            <span style="margin-right:6px">{{merchantInfo.is_auth==1?'已认证':'未认证'}}</span>
            <span style="margin-right:6px">{{merchantInfo.is_supplier==1?'批发供应商':''}}</span>
            <span>{{merchantInfo.dist_supplier==1?'分销供应商':''}}</span>
          </div>
          <a @click.prevent="toBusiness">编辑</a>
        </li>
        <li>
          <div>账户类型</div>
          <div>
            <span style="margin-right:6px">{{merchantInfo.is_auth==2?'体验账户':''}}</span>
            <span style="margin-right:6px">{{merchantInfo.is_supplier==1?'批发供应商':''}}</span>
            <span>{{merchantInfo.dist_supplier==1?'分销供应商':''}}</span>
          </div>
          <span class="sml">编辑企业信息自动升级服务商，添加品牌和商品自动激活店铺成为供应商</span>
        </li>
        <li>
          <div>登录账户</div>
          <div>{{merchantInfo.mobile}}</div>
          <a @click="telVisible=true">更换</a>
        </li>
        <li>
          <div>登录密码</div>
          <div>{{merchantInfo.password}}</div>
          <a @click="pwdVisible=true">重置</a>
        </li>
        <li>
          <div>支付账号</div>
          <div>{{merchantInfo.pay_account==1?'已开通':'未开通'}}</div>
          <a href>编辑</a>
        </li>
        <li>
          <div>子账户</div>
          <div>{{merchantInfo.sub_account}}/{{merchantInfo.all_sub_account}}</div>
          <a href>编辑</a>
        </li>
        <li>
          <div>余额账户</div>
          <div>￥{{merchantInfo.balance}}</div>
          <a href>充值</a>
        </li>
        <li>
          <div>分销账户</div>
          <div>可提现金额：￥{{merchantInfo.cash}} 冻结金额：￥{{merchantInfo.frozen}}</div>
          <span class="sml">-</span>
        </li>
        <li>
          <div>短信账户</div>
          <div>{{merchantInfo.sms_count}}条</div>
          <a href>充值</a>
        </li>
        <li>
          <div>认证品牌数</div>
          <div>{{merchantInfo.brand_count}}</div>
          <a href>添加</a>
        </li>
      </ul>
    </div>
    <div class="detail-2">
      <ul>
        <li>
          <div class="title">自营商品数</div>
          <div class="con">{{merchantAccount.own_goods}}</div>
        </li>
        <li>
          <div class="title">铺货批发商品数</div>
          <div class="con">{{merchantAccount.dist_wholesale_goods}}</div>
        </li>
        <li>
          <div class="title">铺货分销商品数</div>
          <div class="con">{{merchantAccount.dist_store_goods}}</div>
        </li>
        <li>
          <div class="title">发布批发商品数</div>
          <div class="con">{{merchantAccount.release_wholesale_goods}}</div>
        </li>
        <li>
          <div class="title">发布分销商品数</div>
          <div class="con">{{merchantAccount.release_store_goods}}</div>
        </li>
        <li>
          <div class="title">自营咨询订单数</div>
          <div class="con">{{merchantAccount.own_consult_order}}</div>
        </li>
        <li>
          <div class="title">自营零售订单数</div>
          <div class="con">{{merchantAccount.own_sell_order}}</div>
        </li>
        <li>
          <div class="title">自营积分订单数</div>
          <div class="con">{{merchantAccount.own_score_order}}</div>
        </li>
        <li>
          <div class="title">自营卡券订单数</div>
          <div class="con">{{merchantAccount.own_card_order}}</div>
        </li>
        <li>
          <div class="title">提交咨询订单数</div>
          <div class="con">{{merchantAccount.submit_consult_order}}</div>
        </li>
        <li>
          <div class="title">市场分销订单数</div>
          <div class="con">{{merchantAccount.m_dist_order}}</div>
        </li>
      </ul>
      <ul>
        <li>
          <div class="title">收入总金额</div>
          <div class="con">￥{{merchantAccount.all_income}}</div>
        </li>
        <li>
          <div class="title">零售收入金额</div>
          <div class="con">￥{{merchantAccount.sell_income}}</div>
        </li>
        <li>
          <div class="title">积分收入金额</div>
          <div class="con">￥{{merchantAccount.score_income}}</div>
        </li>
        <li>
          <div class="title">卡券收入金额</div>
          <div class="con">￥{{merchantAccount.card_income}}</div>
        </li>
        <li>
          <div class="title">支出总金额</div>
          <div class="con">￥{{merchantAccount.all_spend}}</div>
        </li>
        <li>
          <div class="title">平台消费金额</div>
          <div class="con">￥{{merchantAccount.platform_spend}}</div>
        </li>
        <li>
          <div class="title">分销采购金额</div>
          <div class="con">￥{{merchantAccount.dist_buy_spend}}</div>
        </li>
        <li>
          <div class="title">可开服务发票金额</div>
          <div class="con">￥{{merchantAccount.service_invoice}}</div>
        </li>
        <li>
          <div class="title">可开商品发票金额</div>
          <div class="con">￥{{merchantAccount.goods_invoice}}</div>
        </li>
        <li>
          <div class="title">已创建活动数</div>
          <div class="con">{{merchantAccount.act_count}}</div>
        </li>
        <li>
          <div class="title">总会员数</div>
          <div class="con">{{merchantAccount.all_member}}</div>
        </li>
      </ul>
    </div>
    <div class="detail-1">
      <ul>
        <li>
          <div>营销活动统计</div>
          <div>已购活动{{merchantTj.buy_act_count}}个</div>
          <a href>配置</a>
        </li>
        <li>
          <div>营销商城统计</div>
          <div>已创商城{{merchantTj.market_count}}个，已创商城活动{{merchantTj.market_act_count}}个</div>
          <a href>配置</a>
        </li>
      </ul>
    </div>

    <!-- 更换手机号弹窗 -->
    <resetTel
      :telVisible.sync="telVisible"
      :tel="merchantInfo.mobile"
      :userId="merchantInfo.user_id"
    ></resetTel>
    <!-- 重置密码弹窗 -->
    <resetPwd :pwdVisible.sync="pwdVisible" :userId="merchantInfo.user_id"></resetPwd>
  </div>
</template>

<script>
import resetTel from "./ResetTel";
import ResetPwd from "./ResetPwd";
export default {
  components: { resetTel, ResetPwd },
  data() {
    return {
      api_token: this.$api.getToken(),
      merchantId: this.$route.query.id,
      loading: false,
      merchantInfo: {
        user_id: "",
        enterprise: "",
        is_auth: "",
        is_supplier: "",
        dist_supplier: "",
        mobile: "",
        password: "******",
        pay_account: "",
        sub_account: "",
        balance: "",
        cash: "",
        frozen: "",
        sms_count: "",
        brand_count: ""
      },
      merchantAccount: {
        own_goods: "",
        dist_wholesale_goods: "",
        dist_store_goods: "",
        release_wholesale_goods: "",
        release_store_goods: "",
        own_consult_order: "",
        own_sell_order: "",
        own_score_order: "",
        own_card_order: "",
        submit_consult_order: "",
        m_dist_order: "",
        all_income: "",
        sell_income: "",
        score_income: "",
        card_income: "",
        all_spend: "",
        platform_spend: "",
        dist_buy_spend: "",
        service_invoice: "",
        goods_invoice: "",
        act_count: "",
        all_member: ""
      },
      merchantTj: {
        buy_act_count: "",
        market_count: "",
        market_act_count: ""
      },
      telVisible: false,
      pwdVisible: false
    };
  },
  mounted() {
    this.loadMerchantDetails();
    this.$bus.$on("upload:loadMerchantDetails", h => {
      this.loadMerchantDetails();
    });
  },
  methods: {
    loadMerchantDetails() {
      this.loading = true;
      this.$api
        .get("enterprise/merchant_details", {
          api_token: this.api_token,
          user_id: this.merchantId
        })
        .then(res => {
          if (res.data.code == 200) {
            this.merchantInfo = res.data.data[0];
            this.merchantAccount = res.data.data[1];
            this.merchantTj = res.data.data[2];
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    toBusiness() {
      this.$router.push({ path: "./edit", query: { id: this.$route.query.id } });
    }
  }
};
</script>

<style scoped>
.detail-1,
.detail-2 {
  margin-top: 10px;
  border: 1px solid #c8c5c5;
  font-size: 16px;
  color: #000;
}
.detail-1 li,
.detail-2 li {
  border-bottom: 1px solid #c8c5c5;
  padding: 15px 0;
  display: flex;
  flex-shrink: 1;
}
.detail-1 li:last-child {
  border: none;
}
.detail-1 li > * {
  width: 33.33%;
  text-align: center;
  padding: 0 20px;
}
.detail-1 li .sml {
  font-size: 12px;
  color: #707070;
}
.detail-1 li a {
  color: #44b549;
}
.detail-2 {
  border-right: none;
  display: flex;
  flex-shrink: 1;
}
.detail-2 ul {
  width: 50%;
}
.detail-2 li {
  padding: 0;
}
.detail-2 li .title {
  width: 50%;
  text-align: center;
  padding: 15px 20px;
  background: #ddd;
  border-right: 1px solid #c8c5c5;
}
.detail-2 li .con {
  width: 50%;
  text-align: center;
  padding: 15px 20px;
  border-right: 1px solid #c8c5c5;
}
</style>
