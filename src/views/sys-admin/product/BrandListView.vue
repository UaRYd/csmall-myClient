<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>品牌管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <div style="margin-bottom: 20px;">
      <el-button type="primary" size="medium"
                 @click="$router.push('/sys-admin/product/brand/add-new')">添加品牌
      </el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
      <el-table-column label="LOGO" width="70" align="center">
        <template slot-scope="scope">
          <el-avatar :size="30" :src="scope.row.logo" fit="contain"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="120" align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="pinyin" label="拼音" width="180" align="center"></el-table-column>
      <el-table-column prop="description" label="简介" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="keywords" label="关键词列表" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sort" label="排序序号" width="80" align="center"></el-table-column>
      <el-table-column label="是否启用" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
              @change="toggleEnable(scope.row)"
              v-model="scope.row.enable"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#cccccc">
          </el-switch>
        </template>
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

    <el-dialog title="修改品牌" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="拼音" prop="pinyin">
          <el-input v-model="editForm.pinyin"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" prop="logo">
          <el-input v-model="editForm.logo"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="关键词列表" prop="keywords">
          <el-input v-model="editForm.keywords"></el-input>
        </el-form-item>
        <el-form-item label="排序序号" prop="sort">
          <el-input v-model="editForm.sort"></el-input>
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
        id: '',
        name: '',
        pinyin: '',
        logo: '',
        description: '',
        keywords: '',
        sort: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        pinyin: [
          {required: true, message: '请输入品牌拼音', trigger: 'blur'},
          {min: 4, max: 25, message: '长度在 4 到 25 个字符', trigger: 'blur'}
        ],
        logo: [
          {required: true, message: '请输入品牌LOGO的URL', trigger: 'blur'},
          {min: 10, max: 255, message: '长度在 10 到 255 个字符', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入品牌简介', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
        ],
        keywords: [
          {required: true, message: '请输入品牌关键词列表', trigger: 'blur'},
          {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入品牌排序序号', trigger: 'blur'},
          {pattern: /^(\d{1}|[1-9]{1}[0-9]?)$/, message: '排序序号必须是0~99之间的数字', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    openEditDialog(brand) {
      let url = 'http://localhost:9180/brand/standard?id=' + brand.id;
      console.log('url = ' + url);

      let localJwt = localStorage.getItem('localJwt');

      this.axios
          .create({
            'headers': {
              'Authorization': localJwt
            }
          })
          .get(url).then((response) => {
        let jsonResult = response.data;
        if (jsonResult.state == 20000) {
          this.editForm = jsonResult.data;
          this.dialogFormVisible = true;
        } else {
          this.$alert(jsonResult.message, '错误', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadBrandList();
            }
          });
        }
      });
    },
    submitEditForm() {
      let url = 'http://localhost:9180/brand/update';
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
            message: '修改品牌成功！',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.loadBrandList();
        } else if (jsonResult.state == 40400){
          this.$alert(jsonResult.message, '错误', {
            confirmButtonText: '确定',
            callback: action => {
              this.dialogFormVisible = false;
              this.loadBrandList();
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
    openDeleteConfirm(brand) {
      this.$confirm('此操作将永久删除【' + brand.id + '-' + brand.name + '】品牌，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(brand);
      }).catch(() => {
      });
    },
    handleDelete(brand) {
      let url = 'http://localhost:9180/brand/delete';
      console.log('url = ' + url);

      let formData = 'id=' + brand.id;
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
            message: '删除品牌成功！',
            type: 'success'
          });
          this.loadBrandList();
        } else if (jsonResult.state == 40400) {
          this.$alert(jsonResult.message, '错误', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadBrandList();
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
      this.loadBrandList();
    },
    loadBrandList() {
      let page = this.$router.currentRoute.query.page;
      if (!page) {
        page = 1;
      }

      let url = 'http://localhost:9180/brand/list?page=' + page;
      console.log('url = ' + url);

      let localJwt = localStorage.getItem('localJwt');

      this.axios
          .create({
            'headers': {
              'Authorization': localJwt
            }
          })
          .get(url).then((response) => {
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
    this.loadBrandList();
  }
}
</script>