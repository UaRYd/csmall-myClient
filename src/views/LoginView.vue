<template>
  <div>
    <div style="width: 600px; margin: 60px auto; padding: 20px 50px; background: #fff;">
      <h1 style="margin: 30px auto; text-align: center;">管理员登录</h1>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        username: 'root',
        password: '123456'
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let url = 'http://localhost:9181/admin/login';
              console.log('url = ' + url);

              let formData = this.qs.stringify(this.ruleForm);
              console.log('formData = ' + formData);

              this.axios.post(url, formData).then((response) => {
                let jsonResult = response.data;
                if (jsonResult.state == 20000) {
                  this.$message ({
                    message: '登陆成功！',
                    type: 'success'
                  });
                  let jwt = jsonResult.data;
                  localStorage.setItem('localJwt', jwt);
                  let localJwt = localStorage.getItem('localJwt');
                  console.log(localJwt);
                  this.$router.push('/');
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

<style>
body {
  background: #2c3e50;
}
</style>