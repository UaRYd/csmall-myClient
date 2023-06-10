<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-promotion"></i> 后台管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>属性模板管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <div style="margin-bottom: 20px;">
      <el-button type="primary" size="medium"
                 @click="$router.push('/sys-admin/product/attribute-template/add-new')">添加属性模板
      </el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" width="200" align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="pinyin" label="拼音" width="200" align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="keywords" label="关键词列表" header-align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="sort" label="排序序号" width="80" align="center"></el-table-column>
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

    <el-dialog title="修改属性模板" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="拼音" prop="pinyin">
          <el-input v-model="editForm.pinyin" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关键词列表" prop="keywords">
          <el-input v-model="editForm.keywords" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序序号" prop="sort">
          <el-input v-model="editForm.sort" autocomplete="off"></el-input>
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
        keywords: '',
        sort: ''
      },
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
    }
  },
  methods: {
    openEditDialog(attributeTemplate) {
      let url = 'http://localhost:9180/attribute-template/standard?id=' + attributeTemplate.id;
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
              this.loadAttributeTemplateList();
            }
          });
        }
      });
    },
    submitEditForm() {
      let url = 'http://localhost:9180/attribute-template/update';
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
            message: '修改属性模板成功！',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.loadAttributeTemplateList();
        } else if (jsonResult.state == 40400){
          this.$alert(jsonResult.message, '错误', {
            confirmButtonText: '确定',
            callback: action => {
              this.dialogFormVisible = false;
              this.loadAttributeTemplateList();
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
    openDeleteConfirm(attributeTemplate) {
      this.$confirm('此操作将永久删除【' + attributeTemplate.id + '-' + attributeTemplate.name + '】属性模板，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(attributeTemplate);
      }).catch(() => {
      });
    },
    handleDelete(attributeTemplate) {
      let url = 'http://localhost:9180/attribute-template/delete';
      console.log('url = ' + url);

      let formData = 'id=' + attributeTemplate.id;
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
            message: '删除属性模板成功！',
            type: 'success'
          });
          this.loadAttributeTemplateList();
        } else if (jsonResult.state == 40400) {
          this.$alert(jsonResult.message, '错误', {
            confirmButtonText: '确定',
            callback: action => {
              this.loadAttributeTemplateList();
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
      this.loadAttributeTemplateList();
    },
    loadAttributeTemplateList() {
      let page = this.$router.currentRoute.query.page;
      if (!page) {
        page = 1;
      }

      let url = 'http://localhost:9180/attribute-template/list?page=' + page;
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
    this.loadAttributeTemplateList();
  }
}
</script>