<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/sys-admin/product/album' }">相册管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加相册</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="排序序号" prop="sort">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="warning" @click="$router.push('/sys-admin/product/album')">返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '测试相册001',
        description: '测试相册的简介001',
        sort: '99',
      },
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入简介', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序序号', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]?)$/, message: '排序序号必须是 0~99 之间的数字', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = 'http://localhost:9180/album/add-new';
          console.log('url = ' + url);

          // let formData = 'name=' + this.ruleForm.name
          //    + '&description=' + this.ruleForm.description
          //    + '&sort=' + this.ruleForm.sort;
          let formData = this.qs.stringify(this.ruleForm);
          console.log('formData = ' + formData);

          let localJwt = localStorage.getItem('localJwt');

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
                message: '添加相册成功！',
                type: 'success'
              });
              this.resetForm(formName);
            } else {
              this.$alert(jsonResult.message, '错误', {
                confirmButtonText: '确定',
                callback: action => {
                }
              });
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>