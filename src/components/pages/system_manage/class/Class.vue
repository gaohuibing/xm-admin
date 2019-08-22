<template>
  <div>
    <div class="tabs">
      <ul>
        <li>分类管理</li>
      </ul>
    </div>
    <div style="padding:15px 0" v-loading="loading">
      <el-collapse accordion>
        <template v-for="(item,index) in sortList">
          <el-collapse-item :key="index">
            <template slot="title">
              <div class="first-sort">
                <div class="s-name">{{item.sort_name}}</div>
                <div class="tools" v-on:click.stop="dos">
                  <a @click.prevent="addSecondSort(item.id)">新增二级分类</a>
                  <a @click.prevent="editFirstSort(item.id)">编辑</a>
                  <el-switch
                    v-model="item.is_enable"
                    active-color="#13ce66"
                    inactive-color="#ddd"
                    @change="firstChange($event,item.id,item)"
                  ></el-switch>
                </div>
              </div>
            </template>
            <template v-for="(value,key) in item.second_sort">
              <!-- {{value.id}} -->
              <div class="second-sort" :key="key">
                <div class="s-name" v-text="value.sort_name"></div>
                <div class="tools">
                  <a @click.prevent="editSecondSort(value.id,value.father_id)">编辑</a>
                  <el-switch
                    v-model="value.is_enable"
                    active-color="#13ce66"
                    inactive-color="#ddd"
                    @change="secondChange($event,value.id,value.father_id)"
                  ></el-switch>
                </div>
              </div>
            </template>
          </el-collapse-item>
          <!-- <div :key='index'>{{item.sort_name}}</div> -->
        </template>
      </el-collapse>
      <div class="addfirst">
        <a @click="addFirstSort">+ 新增一级分类</a>
      </div>
    </div>
    <!-- // 一级分类弹窗 -->
    <first-form :visible.sync="firstVisible" :id="firstId"></first-form>
    <!-- // 二级分类弹窗 -->
    <second-form :visible.sync="secondVisible" :id="secondId" :firstId="firstId"></second-form>
  </div>
</template>

<script>
import FirstForm from "./FirstForm";
import SecondForm from "./SecondForm";
export default {
  components: { FirstForm, SecondForm },
  mounted() {
    this.loadSorts();
    this.$bus.$on("upload:loadSorts", h => {
      this.loadSorts();
    });
  },
  data() {
    return {
      api_token: this.$api.getToken(),
      sortList: [],
      loading: false,
      firstVisible: false,
      secondVisible: false,
      firstId: "",
      secondId: ""
    };
  },
  methods: {
    loadSorts() {
      this.loading = true;
      this.$api
        .get("system/get_sort", {
          api_token: this.api_token
        })
        .then(res => {
          if (res.data.code == 200) {
            let resData = res.data.data;
            resData.map(first => {
              first.is_enable == 1
                ? (first.is_enable = true)
                : (first.is_enable = false);
              if (first.second_sort.length) {
                first.second_sort.map(second => {
                  second.is_enable == 1
                    ? (second.is_enable = true)
                    : (second.is_enable = false);
                });
              }
            });
            this.sortList = resData;
          } else {
            this.$message.error({ message: res.data.msg });
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    dos() {},
    //

    editFirstSort(id) {
      this.firstId = id;
      this.firstVisible = true;
    },
    // 添加一级分类
    addFirstSort() {
      this.firstId = null;
      this.firstVisible = true;
    },
    editSecondSort(id, father_id) {
      this.firstId = father_id;
      this.secondId = id;
      this.secondVisible = true;
    },
    // 添加二级分类
    addSecondSort(id) {
      this.firstId = id;
      this.secondId = null;
      this.secondVisible = true;
    },
    firstChange(e, id, item) {
      let is_enable;
      if (e) {
        is_enable = 1;
      } else {
        is_enable = 2;
      }
      item.second_sort.map(value => {
        value.is_enable = e;
      });
      this.$api
        .post("/system/change_first_enable", {
          api_token: this.api_token,
          is_enable: is_enable,
          sort_id: id
        })
        .then(res => {
          if (res.data.code == 200) {
          } else {
            this.$message.error({ message: res.data.msg });
          }
        })
        .catch(err => {
          this.$message.error({ message: err });
        });
    },
    secondChange(e, id, father_id) {
      let is_enable;
      if (e) {
        is_enable = 1;
      } else {
        is_enable = 2;
      }
      this.$api
        .post("/system/change_second_enable", {
          api_token: this.api_token,
          is_enable: is_enable,
          sort_id: id
        })
        .then(res => {
          if (res.data.code == 200) {
          } else {
            this.$message.error({ message: res.data.msg });
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
.first-sort {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
}
.first-sort a {
  color: #44b549;
  padding: 0 6px;
}
.second-sort {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 40px;
  height: 50px;
  align-items: center;
}
.second-sort a {
  color: #44b549;
  padding: 0 6px;
}
.addfirst {
  height: 50px;
  line-height: 50px;
  background: #f5f5f5;
  padding: 0 20px;
}
.addfirst a {
  color: #44b549;
}
</style>
