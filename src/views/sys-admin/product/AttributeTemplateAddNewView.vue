<template>
  <div>
    <!-- 顶部面包屑标识与导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/sys-admin/product/attribute-template' }">属性模板管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加属性模板</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 添加数据的表单 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="拼音" prop="pinyin">
        <el-input v-model="ruleForm.pinyin"></el-input>
      </el-form-item>
      <el-form-item label="关键词列表" prop="keywords">
        <el-input v-model="ruleForm.keywords"></el-input>
      </el-form-item>
      <el-form-item label="排序序号" prop="sort">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="warning" @click="gotoList">返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单
      ruleForm: {
        name: '测试属性模板001',
        pinyin: 'ceshishuxingmuban001',
        keywords: '测试关键词1,测试关键词2,测试关键词3',
        sort: 99
      },
      // 表单规则
      rules: {
        name: [
          {required: true, message: '请输入属性模板名称', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        pinyin: [
          {required: true, message: '请输入属性模板拼音', trigger: 'blur'},
          {min: 4, max: 25, message: '长度在 4 到 25 个字符', trigger: 'blur'}
        ],
        keywords: [
          {required: true, message: '请输入属性模板关键词列表', trigger: 'blur'},
          {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入属性模板排序序号', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]?)$/, message: '排序序号必须是0~99之间的数字', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    // 返回列表
    gotoList() {
      this.$router.push('./');
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:9180/attribute-template/add-new';
          console.log('url = ' + url);

          let formData = this.qs.stringify(this.ruleForm);
          console.log('formData = ' + formData);

          this.axios
              .create({
                'headers': {
                  'Authorization': localJwt
                }
              })
              .post(url, formData).then((response) => {
            let jsonResult = response.data;
            if (jsonResult.state == 20000) {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.resetForm(formName);
            } else {
              this.$message.error(jsonResult.message);
            }
          });
        } else {
          alert('error submit!!');
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
</style>