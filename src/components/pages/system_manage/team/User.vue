<template>
  <div>
    <div class="toolbar">
      <div>
        <el-button size="small" type="primary" @click="addUser">添加用户</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table
        :data="userList.item"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%;"
        v-loading="loading"
      >
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column label="用户姓名" prop="user_name" align="center"></el-table-column>
        <el-table-column label="用户角色" align="center" prop="role_name"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div class="tongji">
              <p>{{statusOptions[scope.row.status]}}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.role_name=='总管理员'">默认</template>
            <template v-else>
              <a
                @click.prevent="toDo(scope.row.id,scope.row.status)"
                style="padding:0 7px;cursor: pointer;color:#44B549;"
              >{{scope.row.status==1?'停用':'启用'}}</a>
              <a
                @click.prevent="editUser(scope.row.id)"
                style="padding:0 7px;color:#44B549;cursor: pointer"
              >编辑</a>
              <a
                @click.prevent="delUser(scope.row.id)"
                style="padding:0 7px;color:#44B549;cursor: pointer"
              >删除</a>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- //底部操作 -->
    <div class="bot-tools" v-if="userList.total">
      <div></div>
      <div class="flex-grow pagi-wrap">
        <div>共{{userList.total}}条，每页{{filter.limits}}条</div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="userList.total-0"
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
  mounted() {
    this.loadUserList();
  },
  data() {
    return {
      api_token: this.$api.getToken(),
      statusOptions: {
        "1": "已启用",
        "2": "未启用"
      },
      page: 1,
      filter: {
        api_token: this.$api.getToken(),
        page: 1,
        limits: 10
      },
      userList: {
        total: "",
        item: []
      },
      loading: false
    };
  },
  methods: {
    // 获取商户概况
    loadUserList() {
      this.loading = true;
      this.$api
        .get("system/get_user_list", this.filter)
        .then(res => {
          if (res.data.code == 200) {
            this.userList = res.data.data;
            this.loading = false;
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    handleCurrentChange(page) {
      this.filter.page = page;
      this.loadUserList();
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
        this.userList.total % this.filter.limits
          ? Math.floor(this.userList.total / this.filter.limits) - 0 + 1
          : this.userList.total / this.filter.limits;
      if (this.page > pageCount || this.page < 1 || this.page == "") {
        this.$message.error("无对应页码");
        return false;
      }
      if (this.page == this.filter.page) {
        return false;
      }
      this.filter.page = this.page;
      this.loadUserList();
    },
    // 增加商户
    addUser() {
      this.$router.push("../user_form");
    },
    editUser(id) {
      this.$router.push({ path: "../user_form", query: { id: id } });
    },
    delUser(id) {
      this.$api
        .post("system/delete_user", { api_token: this.api_token, id: id })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.loadUserList();
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    toDo(id, status) {
      let state = 1;
      if (status == 2) {
        state = 1;
      } else {
        state = 2;
      }
      this.$api
        .post("system/change_user_enable", {
          api_token: this.api_token,
          id: id,
          status: state
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.loadUserList();
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    }
  }
};
</script>
<style scoped>
</style>