<template>
  <div v-loading="loading">
    <div class="a-bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/systemmanage/help/list' }">帮助管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{helpId?'编辑帮助':'添加帮助'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="formData" :rules="rules" ref="ruleForm">
      <div class="form-content" style="padding-top:60px">
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>选择板块：
          </div>
          <div>
            <el-form-item prop="block_id">
              <el-select v-model="formData.block_id" placeholder="请选择">
                <el-option
                  v-for="(item) in helpBlock"
                  :key="item.id"
                  :label="item.block"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="form-group">
          <div class="f-label">
            <span style="color:red">*</span>帮助标题：
          </div>
          <div>
            <el-form-item prop="title">
              <el-input
                type="text"
                v-model="formData.title"
                placeholder="请输入标题名称"
                auto-complete="new-password"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-group" style="align-items:flex-start">
          <div class="f-label">
            <span style="color:red">*</span>帮助内容：
          </div>
          <div>
            <el-form-item prop="content">
              <div class="detial-edit">
                <quill-editor
                  v-model="formData.content"
                  ref="myQuillEditor"
                  :options="editorOption"
                ></quill-editor>
              </div>
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="bot-tools-t">
        <el-button type="primary" @click="submit('ruleForm')">确定</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
    </el-form>
    <el-dialog
      :visible.sync="submitVisible"
      title="新建帮助成功"
      width="30%"
      class="submitDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div style="display:flex;align-items:center">
        <i class="el-icon-success" style="color:#44B549;font-size:20px;margin-right:6px"></i>
        新建帮助成功，你可以进行以下快捷操作
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$router.go(-1)" size="small">返回帮助管理</el-button>
        <el-button @click="addMore" size="small">继续新增</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { quillRedefine } from "vue-quill-editor-upload";
export default {
  mounted() {
    this.loadHelpBlock();
  },
  components: { quillRedefine },
  data() {
    return {
      apiUrl: this.$api.apiUrl + "system/upload_help_img",
      api_token: this.$api.getToken(),
      rules: {
        block_id: [
          { required: true, message: "请选择板块", trigger: "change" }
        ],
        title: [{ required: true, message: "请输入板块标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入板块内容", trigger: "blur" }
        ]
      },
      helpBlock: [],
      formData: {
        api_token: this.$api.getToken(),
        block_id: "",
        title: "",
        content: ""
      },

      helpId: this.$route.query.id || "",
      submitVisible: false,
      // 富文本初始化
      editorOption: {
        // some quill options
      },
      loading: false
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  created() {
    this.editorOption = quillRedefine({
      // 图片上传的设置
      uploadConfig: {
        action: this.apiUrl, // 必填参数 图片上传地址
        // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
        // 你必须把返回的数据中所包含的图片地址 return 回去
        res: respnse => {
          return respnse.data;
        },
        methods: "POST", // 可选参数 图片上传方式  默认为post
        name: "file", // 可选参数 文件的参数名 默认为img
        size: 2000, // 可选参数   图片限制大小，单位为Kb, 1M = 1024Kb
        accept: "image/png, image/gif, image/jpeg, image/bmp, image/x-icon", // 可选参数 可上传的图片格式
        header: (xhr, formData) => {
          formData.append("api_token", this.$api.getToken());
        }
      }
    });
  },
  methods: {
    loadhelpData() {
      if (this.helpId) {
        this.loading = true;
        this.$api
          .get("system/get_help_details", {
            api_token: this.api_token,
            id: this.helpId
          })
          .then(res => {
            if (res.data.code == 200) {
              this.formData = res.data.data;
            } else {
              this.$message.error({ message: res.data.msg });
            }
            this.loading = false;
          })
          .catch(err => {
            this.$message.error({ message: err });
          });
      }
    },
    // 获取板块map
    loadHelpBlock() {
      this.$api
        .get("system/get_help_block", { api_token: this.api_token })
        .then(res => {
          if (res.data.code == 200) {
            this.helpBlock = res.data.data;
            this.loadhelpData();
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
          this.loading = true;
          if (this.helpId) {
            // 编辑
            this.$api
              .post("system/edit_help", {
                ...this.formData,
                api_token: this.api_token,
                id: this.helpId
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  setTimeout(h => {
                    this.$router.go(-1);
                  }, 1000);
                } else {
                  this.$message.error({ message: res.data.msg });
                  this.loading = false;
                }
              })
              .catch(err => {
                this.$message.error({ message: err });
                this.loading = false;
              });
          } else {
            // 添加
            this.$api
              .post("system/add_help", {
                ...this.formData,
                api_token: this.api_token
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.$message({
                    message: "添加成功",
                    type: "success"
                  });
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
            // }
          }
        } else {
          this.$message.error("请将信息填写完整");
          this.loading = false;
          return false;
        }
      });
    },
    addMore() {
      this.submitVisible = false;
      this.formData = {
        api_token: this.$api.getToken(),
        block_id: "",
        title: "",
        content: ""
      };
    }
  }
};
</script>
<style scoped>
.form-group .el-input,
.form-group .el-cascader {
  width: 240px;
}
.detial-edit {
  width: 600px;
  padding: 0;
}
</style>
<style>
.ql-video {
  display: none !important;
}
</style>