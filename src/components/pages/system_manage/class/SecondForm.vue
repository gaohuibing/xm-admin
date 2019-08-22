<template>
  <div>
    <!-- 审核不通过弹窗 -->
    <el-dialog
      :visible.sync="currentVisible"
      :title="id?'编辑二级分类':'添加二级分类'"
      width="30%"
      class="submitDialog"
    >
      <div class="form-content">
        <div class="form-group">
          <div class="f-label">分类名称：</div>
          <div style="width:224px">
            <el-input type="text" v-model="sort_name" placeholder="请输入分类名称"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitHandle" size="small">确认</el-button>
        <el-button @click="currentVisible=false" size="small">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["visible", "id",'firstId'],
  mounted() {
    
  },
  data() {
    return {
      currentVisible: false,
      // 分类名称
      sort_name: ""
    };
  },
  methods: {
    // 获取数据
    loadData() {
      if (this.id) {
        this.$api
          .get("system/get_second_sort", {
            api_token: this.$api.getToken(),
            id: this.id
          })
          .then(res => {
            if (res.data.code == 200) {
              this.sort_name = res.data.data.sort_name;
            } else {
              this.$message.error({ message: res.data.msg });
            }
          })
          .catch(err => {
            this.$message.error({ message: err });
          });
      }
    },
    // 提交
    submitHandle() {
      if (!this.sort_name) {
        this.$message.error("请填写分类名称");
        return false;
      }
      if (this.id) {
        // 编辑
        this.$api
          .post("system/edit_second_sort", {
		api_token: this.$api.getToken(),
		id:this.id,
		father_id:this.firstId,
		sort_name:this.sort_name
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: "编辑二级分类成功",
                type: "success"
              });
              this.currentVisible = false;
              this.$bus.$emit("upload:loadSorts");
            } else {
              this.$message.error({ message: res.data.msg });
            }
          })
          .catch(err => {
            this.$message.error({ message: err });
          });
      } else {
	  // 添加
	  this.$api
          .post("system/add_second_sort", {
		api_token: this.$api.getToken(),	
		sort_name:this.sort_name,
		father_id:this.firstId,
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: "添加二级分类成功",
                type: "success"
              });
              this.currentVisible = false;
              this.$bus.$emit("upload:loadSorts");
            } else {
              this.$message.error({ message: res.data.msg });
            }
          })
          .catch(err => {
            this.$message.error({ message: err });
          });
      }
    }
  },
  watch: {
    visible(value) {
	this.currentVisible = value;
	this.loadData();
    },
    currentVisible(value) {
      this.$emit("update:visible", value);
    }
  }
};
</script>

<style scoped>
</style>