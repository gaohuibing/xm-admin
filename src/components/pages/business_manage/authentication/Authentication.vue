<template>
  <div>
    <div class="tabs">
      <ul>
        <li
          v-for="(item, index) in tabs"
          :key="index"
          :class="{'active':item.status==filter.status}"
          @click="tabHandle(item.status)"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="list-tools">
      <div class="tool-1 clearfix" style="margin-bottom: 10px;">
        <div class="t">
          <span>订单编号：</span>
          <div class="inp-box">
            <el-input v-model="filter.order_num" placeholder="请输入"></el-input>
          </div>
        </div>
        <div class="t">
          <span>商户名称：</span>
          <div class="inp-box">
            <el-input v-model="filter.merchant" placeholder="请输入"></el-input>
          </div>
        </div>
        <div class="cz">
          <el-button type="primary" size="small" @click="filterHandle">筛选</el-button>
          <el-button size="small" @click="resetHandle">重置</el-button>
        </div>
      </div>
      <div class="tool-1 clearfix">
        <div class="t">
          <span>注册时间：</span>
          <div class="inp-box">
            <el-date-picker
              v-model="timeRange"
              type="daterange"
              range-separator="-"
              @change="timeChange"
              start-placeholder="开始日期"
              format="yyyy-MM-dd"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </div>

        <div class="export">
          <a href="javascript:;" style="color:#999">导出报表</a>
        </div>
      </div>
    </div>
    <div class="toolbar"></div>
    <div class="table-content">
      <el-table
        :data="authLists.item"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column label="订单编号" prop="order_num" align="center"></el-table-column>
        <el-table-column prop="submit_at" label="申请时间" align="center"></el-table-column>
        <el-table-column prop="enterprise" label="商户名称" align="center"></el-table-column>
        <el-table-column prop="content" label="认证状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.review_status==1" style="color:#FF3A3A">待审核</span>
            <span v-if="scope.row.review_status==2">已认证</span>
            <span v-if="scope.row.review_status==3">未通过</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <a
              @click.prevent="shenHe(scope.row.id)"
              style="cursor: pointer;color:#44B549;"
              v-if="scope.row.review_status==1"
            >审核</a>
            <a
              @click.prevent="shenHe(scope.row.id)"
              style="cursor: pointer;color:#44B549;"
              v-else
            >详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- //底部操作 -->
    <div class="bot-tools" v-if="authLists.total">
      <div></div>
      <div class="flex-grow pagi-wrap">
        <div>共{{authLists.total}}条，每页{{filter.limits}}条</div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="authLists.total-0"
          :current-page="filter.page-0"
          :pager-count="5"
          :page-size="filter.limits-0"
          @current-change="handleCurrentChange"
        ></el-pagination>
        <div>
          到第
          <el-input v-model="page" class="topage" :change="limit('page',page)"></el-input>页
          <el-button size="small" class="pageBtn" @click="toPage">GO</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabs: [
        {
          name: "待审核",
          status: 1
        },
        {
          name: "已认证",
          status: 2
        },

        {
          name: "审核未通过",
          status: 3
        }
      ],
      page: "1",
      authLists: {
        data: [],
        total: ""
      },
      filter: {
        api_token: this.$api.getToken(),
        status: "",
        order_num: "",
        merchant: "",
        start: "",
        end: "",
        page: 1,
        limits: 10
      },
      timeRange: "",
      loading: false
    };
  },
  mounted() {
    this.filter.status = this.$route.query.status || "1";
    this.loadAuthList();
  },
  methods: {
    tabHandle(status) {
      this.$router.push({
        path: "/businessmanage/authentication",
        query: {
          status: status
        }
      });
    },
    loadAuthList() {
      this.loading = true;
      this.$api
        .get("enterprise/get_auth_list", this.filter)
        .then(res => {
          if (res.data.code == 200) {
            this.authLists = res.data.data;
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    filterHandle() {
      this.loadAuthList();
    },
    resetHandle() {
      this.filter = {
        api_token: this.$api.getToken(),
        status: this.$route.query.status || "1",
        order_num: "",
        merchant: "",
        start: "",
        end: "",
        page: 1,
        limits: 10
      };
      this.timeRange = "";
      this.loadAuthList();
    },
    timeChange(value) {
      this.filter.start = this.$moment(value[0]).format("YYYY-MM-DD");
      this.filter.end = this.$moment(value[1]).format("YYYY-MM-DD");
    },
    handleCurrentChange(page) {
      this.filter.page = page;
      this.getWarehouse();
    },
    limit(obj, value) {
      // 通过正则过滤小数点后两位
      //     this.s_sell_price= this.s_sell_price.replace(/[^\a-\z\A-\Z0-9]/g, '');
      var price = "" + value;
      price = price
        .replace(/[^\d.]/g, "") // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, ".") // 只保留第一个. 清除多余的
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".")
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
      if (price.indexOf(".") < 0 && price != "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        price = parseFloat(price);
      }
      price = price + "";
      if (price.split(".")[0].length > 7) {
        price = `
          ${price.split(".")[0].slice(0, 7)}`;
      }
      if (obj.split(".")[1]) {
        this[`${obj.split(".")[0]}`][`${obj.split(".")[1]}`] = price;
      } else {
        this[obj] = price;
      }
    },
    // 前往第几页
    toPage() {
      let pageCount =
        this.authLists.total % this.filter.limits
          ? Math.floor(this.authLists.total / this.filter.limits) - 0 + 1
          : this.authLists.total / this.filter.limits;
      if (this.page > pageCount || this.page < 1 || this.page == "") {
        this.$message.error("无对应页码");
        return false;
      }
      if (this.page == this.filter.page) {
        return false;
      }
      this.filter.page = this.page;
      this.loadMerchantList();
    },
    // 审核
    shenHe(id) {
      this.$router.push({ path: "./certification", query: { id: id } });
    },
    // 审核
    detials(id) {}
  },
  watch: {
    $route(value) {
      this.filter.status = value.query.status;
      this.loadAuthList();
    }
  }
};
</script>
<style scoped>
.tabs li {
  width: 70px;
}

.list-tools {
  background: #f6f7ff;
  padding: 15px;
  margin-top: 20px;
}

.list-tools .tool-1 .t {
  width: 300px;
  display: flex;
  height: 34px;
  line-height: 34px;
  float: left;
}
.list-tools .tool-1 i {
  font-size: 12px;
  color: #999;
}
.list-tools .tool-1 .ls {
  width: 460px;
  float: left;
  display: flex;
  height: 34px;
  line-height: 34px;
  margin-left: 20px;
}
.list-tools .ls .input-group {
  width: 180px;
}
.list-tools .t .input-group,
.list-tools .t .btn-group {
  width: 220px;
}
.list-tools .t .btn-group button {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.cz {
  float: right;
  display: flex;
  width: 170px;
  justify-content: flex-end;
}
.list-tools .tool-1 p {
  width: 200px;
  float: left;
  line-height: 34px;
  color: #999;
  font-size: 12px;
  margin: 0;
}
.list-tools .tool-1 .export {
  width: 100px;
  float: right;
  line-height: 34px;
  text-align: right;
}

.table-tools {
  display: flex;
  padding: 20px 0;
}
/* 可复用开始 */
.order-list-wrap {
  /* position: absolute;
	left: 24px;
	right: 14px;
    top: 246px;
	bottom: 80px;
	overflow-y: auto; */
}
.order-list-wrap .list-header {
  height: 46px;
  background: #f6f7ff;
}
.order-list-wrap .list-header li {
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: #000;
  border-right: 1px solid #d9d9d9;
  float: left;
  margin-top: 11px;
}
.order-list-wrap .list-header li:last-child {
  border: none;
}
.order-list-wrap .len-a {
  width: 205px;
}
.order-list-wrap .len-b {
  width: 75px;
  float: left;
  text-align: center;
}
.order-list-wrap .len-c {
  width: 75px;
  float: left;
  text-align: center;
}
.order-list-wrap .len-d {
  width: 75px;
  float: left;
  text-align: center;
}
.order-list-wrap .len-e {
  width: 75px;
  float: left;
  text-align: center;
}
.order-list-wrap .len-f {
  width: 136px;
}
.order-list-wrap .len-g {
  width: 120px;
}
.order-list-wrap .len-h {
  width: 93px;
}
.order-list-wrap .len-i {
  width: 83px;
}
.order-list-wrap .list-main > li {
  width: 100%;
  border-radius: 4px 4px 0px 0px;
  border: 1px solid rgba(0, 0, 0, 0.09);
}
.order-list-wrap .list-main .top {
  height: 46px;
  background: #fafafa;
  color: #000000;
  font-size: 14px;
  padding: 0 15px;
  display: flex;
}
.order-list-wrap .list-main .order-num {
  line-height: 46px;
}
.order-list-wrap .list-main .checkbox {
  margin-top: 12px;
}
.order-list-wrap .list-main .order-num span {
  margin-right: 20px;
}
.order-list-wrap .list-main .order-type {
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  border: 1px solid #ffbe00;
  color: #ffbe00;
  font-size: 12px;
  padding: 0 8px;
  margin-top: 13px;
}
.order-list-wrap .list-main .order-type-green {
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  border: 1px solid #44b549;
  color: #44b549;
  font-size: 12px;
  padding: 0 8px;
  margin-top: 13px;
}
.order-list-wrap .list-main .order-info > ul,
.order-list-wrap .list-main .order-info > div {
  float: left;
  color: rgba(0, 0, 0, 0.65);
}
.order-list-wrap .list-main .order-info p {
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 14px;
}
.order-list-wrap .list-main .order-info > ul {
  padding-left: 24px;
}
.order-list-wrap .list-main .order-info li {
  padding: 24px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
}
.order-list-wrap .list-main .order-info li > div {
  color: rgba(0, 0, 0, 0.65);
}
.order-list-wrap .list-main .order-info li:last-child {
  border: none;
}
.order-list-wrap .list-main .order-info li .good-pic {
  width: 50px;
  height: 50px;
  float: left;
}
.order-list-wrap .list-main .order-info li .good-name {
  width: 121px;
  float: left;
  margin-left: 10px;
}
.order-list-wrap .list-main .order-info li .good-pic img {
  width: 100%;
  height: 100%;
}
.order-list-wrap .order-info .len-f {
  padding: 24px 0;
}
.order-list-wrap .order-info .len-g,
.order-list-wrap .order-info .len-h,
.order-list-wrap .order-info .len-i {
  text-align: center;
  padding: 24px 0;
}
</style>


