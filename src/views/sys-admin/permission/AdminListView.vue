<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <div style="margin-bottom: 20px;">
      <el-button type="primary" size="medium"
                 @click="$router.push('/sys-admin/permission/admin/add-new')">添加管理员
      </el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
      <el-table-column prop="nickname" label="名称" width="180" header-align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="description" label="简介" header-align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="sort" label="排序序号" width="100" align="center"></el-table-column>
      <el-table-column label="查看图片" width="100" align="center">
        <el-button size="mini">查看</el-button>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle
                     @click="openEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" circle
                     @click="openDeleteConfirm(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: right; margin: 10px auto;">
      <el-pagination
          @current-change="changePage"
          layout="total, prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize">
      </el-pagination>
    </div>

    <el-dialog title="修改管理员" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="名称" prop="nickname">
          <el-input v-model="editForm.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="phone">
          <el-input v-model="editForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序序号" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序序号" prop="description">
          <el-input v-model="editForm.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否开启" prop="enable">
          <el-input v-model="editForm.enable" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      dialogFormVisible: false,
      editForm: {
        nickname: '',
        phone: '',
        email: '',
        description: '',
        enable: ''
      },
      rules: {
        nickname: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入简介', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入排序序号', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]?)$/, message: '排序序号必须是 0~99 之间的数字', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入简介', trigger: 'blur'}
        ],
        enable: [
          {required: true, message: '请输入简介', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    openEditDialog(admin) {

      let url = 'http://localhost:9181/admin/standard?id=' + admin.id;
      console.log('url = ' + url);

      let localJwt = localStorage.getItem('localJwt');

      this.axios
          .create({
            'headers': {
              'Authorization': localJwt
            }
          })
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.editForm = jsonResult.data;
          this.dialogFormVisible = true;
        } else {
          this.$alert(jsonResult.message, '错误', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadAdminList();
            }
          });
        }
      });
    },
    submitEditForm() {
      let url = 'http://localhost:9181/admin/update';
      console.log('url = ' + url);

      let formData = this.qs.stringify(this.editForm);
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
            message: '修改管理员成功！',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.loadAdminList();
        } else if (jsonResult.state == 40400){
          this.$alert(jsonResult.message, '错误', {
            confirmButtonText: '确定',
            callback: action => {
              this.dialogFormVisible = false;
              this.loadAdminList();
            }
          });
        } else {
          this.$alert(jsonResult.message, '错误', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      });
    },
    openDeleteConfirm(admin) {
      this.$confirm('此操作将永久删除【' + admin.id + '-' + admin.nickname + '】管理员，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(admin);
      }).catch(() => {
      });
    },
    handleDelete(admin) {
      let url = 'http://localhost:9181/admin/delete';
      console.log('url = ' + url);

      let formData = 'id=' + admin.id;
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
            message: '删除相册成功！',
            type: 'success'
          });
          this.loadAdminList();
        } else if (jsonResult.state == 40400) {
          this.$alert(jsonResult.message, '错误', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadAdminList();
            }
          });
        } else if (jsonResult.state == 40900) {
          this.$alert(jsonResult.message, '错误', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      });
    },
    changePage(value) {
      this.$router.replace('?page=' + value);
      this.loadAdminList();
    },
    loadAdminList() {
      let page = this.$router.currentRoute.query.page;
      if (!page) {
        page = 1;
      }

      let url = 'http://localhost:9181/admin/list?page=' + page;
      console.log('url = ' + url);

      let localJwt = localStorage.getItem('localJwt');

      this.axios
          .create({
            'headers': {
              'Authorization': localJwt
            }
          })
          .post(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.tableData = jsonResult.data.list;
          this.total = jsonResult.data.total;
          this.pageSize = jsonResult.data.pageSize;
          this.currentPage = jsonResult.data.currentPage;
        } else {
          this.$alert(jsonResult.message, '错误', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      });
    }
  },
  mounted() {
    this.loadAdminList();
  }
}
</script>