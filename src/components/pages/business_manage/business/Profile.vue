<template>
  <div>
    <div class="info-item">
      <span>商户概况</span>
      <ul class="info-list">
        <li>
          <h5>{{total.experience_merchant}}</h5>
          <p>体验商户</p>
        </li>
        <li>
          <h5>{{total.service_provider}}</h5>
          <p>服务商</p>
        </li>
        <li>
          <h5>{{total.wholesale_supplier}}</h5>
          <p>批发供应商</p>
        </li>
        <li>
          <h5>{{total.dist_supplier}}</h5>
          <p>分销供应商</p>
        </li>
      </ul>
    </div>
    <div class="info-item">
      <span>待办事项</span>
      <ul class="info-list">
        <li>
          <h5>{{enterprise_auth}}</h5>
          <p>企业认证</p>
        </li>
      </ul>
    </div>
    <div class="list-tools">
      <div class="tool-1 clearfix" style="margin-bottom: 10px;">
        <div class="t">
          <span>商户筛选：</span>
          <div class="inp-box">
            <el-input v-model="filter.merchant" placeholder="请输入"></el-input>
          </div>
        </div>
        <div class="t">
          <span>商户类型：</span>
          <div class="inp-box">
            <el-select v-model="filter.type" placeholder="请选择">
              <el-option v-for="(item,key) in typeOptions" :key="key" :label="item" :value="key"></el-option>
            </el-select>
          </div>
        </div>
        <div class="cz">
          <el-button type="primary" size="small" @click="filterHandle">筛选</el-button>
          <el-button size="small" @click="resetHandle">重置</el-button>
        </div>
      </div>
      <div class="tool-1 clearfix">
        <div class="t">
          <span>商户状态：</span>
          <div class="inp-box">
            <el-select v-model="filter.account_status" placeholder="请选择">
              <el-option v-for="(item,key) in statusOptions" :key="key" :label="item" :value="key"></el-option>
            </el-select>
          </div>
        </div>
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
    <div class="toolbar">
      <div>
        <el-button size="small" type="primary" @click="addMerchant">新增商户</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table
        :data="serviceLists.item"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%;"
        v-loading="loading"
      >
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column label="商户信息" align="center" width="230">
          <template slot-scope="scope">
            <div class="busines-info">
              <img :src="scope.row.logo" alt />
              <div class="i-right">
                <h5>{{scope.row.enterprise}}</h5>
                <p>联系人：{{scope.row.contacts}}</p>
                <p>联系电话：{{scope.row.mobile}}</p>
                <p>所在地：{{$common.regionFormat(`${scope.row.province}-${scope.row.city}-${scope.row.county}`)}}</p>
                <p>注册时间：{{scope.row.created_at}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="访问统计" align="center">
          <template slot-scope="scope">
            <div class="tongji">
              <p style="margin-bottom:20px">访问次数：{{scope.row.count}}</p>
              <p>
                最近访问时间
                <br />
                {{scope.row.updated_at}}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商户类型" prop align="center">
          <template slot-scope="scope">
            <div class="tongji">
              <p>{{scope.row.is_auth==2?'体验用户':'服务商'}}</p>
              <template v-if="scope.row.is_auth==1">
                <p v-if="scope.row.is_supplier==1">批发供应商</p>
                <p v-if="scope.row.dist_supplier==1">分销供应商</p>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商户状态" align="center">
          <template slot-scope="scope">
            <div class="tongji">
              <p>{{statusOptions[scope.row.account_status]}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="资产统计" align="center" width="140">
          <template slot-scope="scope">
            <div class="tongji" >
              <p style='text-align:left'>余额账户：￥{{scope.row.balance}}</p>
              <p style='text-align:left'>分销账户：￥{{scope.row.dist}}</p>
              <p style='text-align:left'>剩余短信：￥{{scope.row.sms_count}}</p>
              <p style='text-align:left'>平台消费：￥{{scope.row.platform}}</p>
              <p style='text-align:left'>分销采购：￥{{scope.row.dist_purch}}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <a
              @click.prevent="toDetails(scope.row.id)"
              style="padding:0 7px;cursor: pointer;color:#44B549;"
            >详情</a>
            <a @click.prevent style="padding:0 7px;color:#44B549;cursor: pointer">进入后台</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- //底部操作 -->
    <div class="bot-tools" v-if='serviceLists.total'>
      <div></div>
      <div class="flex-grow pagi-wrap">
        <div>共{{serviceLists.total}}条，每页{{filter.limits}}条</div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="serviceLists.total-0"
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
      api_token: this.$api.getToken(),
      typeOptions: {
        "1": "体验账户",
        "2": "服务商",
        "3": "批发供应商",
        "4": "分销供应商"
      },
      statusOptions: {
        "1": "启用",
        "2": "停用"
      },
      value: "",
      filter: {
        api_token: this.$api.getToken(),
        merchant: "",
        type: "",
        account_status: "",
        start: "",
        end: "",
        page: 1,
        limits: 10
      },
      timeRange: "",
      page: "1",
      serviceLists: {
        data: [],
        total: 0
      },
      // 商户概况
      total: {
        experience_merchant: 0,
        service_provider: 0,
        wholesale_supplier: 0,
        dist_supplier: 0
      },
      // 待办事项
      enterprise_auth: 0,
      loading: false
    };
  },
  mounted() {
    this.loadMerchantSurvey();
    this.loadMerchantList();
  },
  methods: {
    // 获取商户概况
    loadMerchantSurvey() {
      this.$api
        .get("enterprise/merchant_survey", { api_token: this.api_token })
        .then(res => {
          if (res.data.code == 200) {
            this.total = res.data.data;
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    // 获取待办事项
    loadTodoItems() {
      this.$api
        .get("enterprise/todo_items", { api_token: this.api_token })
        .then(res => {
          if (res.data.code == 200) {
            this.enterprise_auth = res.data.data;
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    timeChange(value) {
      this.filter.start = this.$moment(value[0]).format("YYYY-MM-DD");
      this.filter.end = this.$moment(value[1]).format("YYYY-MM-DD");
    },
    loadMerchantList() {
      this.loading = true;
      this.$api
        .get("enterprise/get_merchant", this.filter)
        .then(res => {
          if (res.data.code == 200) {
            this.serviceLists = res.data.data;
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    filterHandle() {
      this.loadMerchantList();
    },
    resetHandle() {
      this.filter = {
        api_token: this.$api.getToken(),
        merchant: "",
        type: "",
        account_status: "",
        start: "",
        end: "",
        page: 1,
        limits: 10
      };
      this.timeRange = "";
      this.loadMerchantList();
    },
    handleCurrentChange(page) {
      this.filter.page = page;
      this.loadMerchantList();
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
        this.serviceLists.total % this.filter.limits
          ? Math.floor(this.serviceLists.total / this.filter.limits) - 0 + 1
          : this.serviceLists.total / this.filter.limits;
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
    // 前往商户详情
    toDetails(id) {
      this.$router.push({
        path: "./detail",
        query: {
          id: id
        }
      });
    },
    // 新增商户
    addMerchant(){
	   this.$router.push({
        path: "./add",        
      }); 
    }
  }
};
</script>

<style scoped>
.list-tools {
  background: #f6f7ff;
  padding: 15px;
  margin-top: 20px;
}
.info-item {
  border: 1px solid #ccc;
  padding: 15px;
  display: flex;
  margin-top: 16px;
}
.info-item span {
  color: #333;
  font-size: 16px;
  font-weight: 600;
}
.info-item ul {
  display: flex;
  flex-shrink: 1;
  flex-grow: 1;
}
.info-item li {
  width: 20%;
  text-align: center;
}
.info-item li h5 {
  font-size: 20px;
  font-weight: 600;
  color: #000;
  margin-bottom: 10px;
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

.busines-info {
  width: 220px;
  display: flex;
  flex-shrink: 1;
}
.busines-info img {
  width: 40px;
  height: 40px;
  margin-right: 8px;
}
.busines-info .i-right {
  flex-grow: 1;
}
.busines-info .i-right h5 {
  font-size: 12px;
  color: #000;
  margin-bottom: 20px;
  text-align: left;
}
.busines-info .i-right p {
  font-size: 12px;
  margin-bottom: 8px;
  color: #666;
  text-align: left;
}
.tongji {
  font-size: 12px;
}
.tongji p {
  line-height: 1.5;
}
</style>
