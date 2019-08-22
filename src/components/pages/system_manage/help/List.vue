<template>
  <div>
    <div class="toolbar">
      <div>
        <el-button size="small" type="primary" @click="addHelp">新建帮助</el-button>
      </div>
    </div>
    <div class="list-tools">
      <div class="tool-1 clearfix" style="margin-bottom: 10px;">
        <div class="t">
          <span>帮助标题：</span>
          <div class="inp-box">
            <el-input v-model="filter.title" placeholder="请输入标题名称"></el-input>
          </div>
        </div>
        <div class="t">
          <span>板块筛选：</span>
          <div class="inp-box">
            <el-select v-model="filter.block_id" placeholder="请选择">
              <el-option
                v-for="(item,key) in helpBlock"
                :key="key"
                :label="item.block"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="cz">
          <el-button type="primary" size="small" @click="filterHandle">筛选</el-button>
          <el-button size="small" @click="resetHandle">重置</el-button>
        </div>
      </div>
    </div>

    <div class="table-content">
      <el-table
        :data="helpLists.item"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%;"
        v-loading="loading"
      >
        <!-- <el-table-column type="index" width="50" label="序号" align="center"></el-table-column> -->
        <el-table-column label="帮助标题" prop="title" align="center" width="230"></el-table-column>
        <el-table-column label="所属板块" prop="block" align="center"></el-table-column>

        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <a
              @click.prevent="editHandle(scope.row.id)"
              style="padding:0 7px;cursor: pointer;color:#44B549;"
            >编辑</a>
            <a
              @click.prevent="delHandle(scope.row.id)"
              style="padding:0 7px;color:#44B549;cursor: pointer"
            >删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- //底部操作 -->
    <div class="bot-tools" v-if="helpLists.total">
      <div></div>
      <div class="flex-grow pagi-wrap">
        <div>共{{helpLists.total}}条，每页{{filter.limits}}条</div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="helpLists.total-0"
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
      helpBlock: [],
      filter: {
        api_token: this.$api.getToken(),
        title: "",
        block_id: "",
        page: 1,
        limits: 10
      },
      timeRange: "",
      page: "1",
      helpLists: {
        data: [],
        total: 0
      },
      loading: false
    };
  },
  mounted() {
    this.loadHelpBlock();
    this.loadHelpLists();
  },
  methods: {
    // 获取板块map
    loadHelpBlock() {
      this.$api
        .get("system/get_help_block", { api_token: this.api_token })
        .then(res => {
          if (res.data.code == 200) {
            this.helpBlock = res.data.data;
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    // 获取商户概况
    loadHelpLists() {
      this.loading = true;
      this.$api
        .get("system/get_help_list", this.filter)
        .then(res => {
          if (res.data.code == 200) {
            this.helpLists = res.data.data;
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },

    filterHandle() {
      this.loadHelpLists();
    },
    resetHandle() {
      this.filter = {
        api_token: this.$api.getToken(),
        title: "",
        block_id: "",
        page: 1,
        limits: 10
      };
      this.timeRange = "";
      this.loadHelpLists();
    },
    handleCurrentChange(page) {
      this.filter.page = page;
      this.loadHelpLists();
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
        this.helpLists.total % this.filter.limits
          ? Math.floor(this.helpLists.total / this.filter.limits) - 0 + 1
          : this.helpLists.total / this.filter.limits;
      if (this.page > pageCount || this.page < 1 || this.page == "") {
        this.$message.error("无对应页码");
        return false;
      }
      if (this.page == this.filter.page) {
        return false;
      }
      this.filter.page = this.page;
      this.loadHelpLists();
    },
    // 前往商户详情
    editHandle(id) {
      this.$router.push({
        path: "./help_form",
        query: {
          id: id
        }
      });
    },
    // 新增帮助
    addHelp() {
      this.$router.push({
        path: "./help_form"
      });
    }
  }
};
</script>

<style scoped>
.list-tools {
  background: #f6f7ff;
  padding: 15px;
  margin-bottom: 20px;
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
