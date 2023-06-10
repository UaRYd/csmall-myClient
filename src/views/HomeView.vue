 <template>
  <div>
    <!-- 整个容器 -->
    <el-container>
      <!-- 上半部分：顶栏 -->
      <el-header class="layout-header">
        <!-- 显示当前登录的用户信息 -->
        <div class="login-user">
          <span class="welcome">欢迎回来，root！</span>
          <el-dropdown>
            <el-avatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                       size="small"></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus">修改资料</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus">修改头像</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus-outline">修改密码</el-dropdown-item>
              <el-dropdown-item icon="el-icon-check" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 左侧的标题文字 -->
        <h1>酷鲨商城运营管理平台</h1>
      </el-header>
      <!-- 下半部分 -->
      <el-container class="layout-body">
        <!-- 下半部分的左侧：侧边栏 -->
        <el-aside class="layout-aside">
          <el-menu
              router
              :default-active="activeMenuItemPath"
              class="el-menu-vertical-demo"
              background-color="#222"
              text-color="#fff"
              active-text-color="#fff">
            <!-- 首页 -->
            <el-menu-item index="1">
              <i class="el-icon-s-home"></i>
              <span>首页</span>
            </el-menu-item>
            <!-- 商品管理 -->
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-goods"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="2-1" disabled>
                <i class="el-icon-s-grid"></i>
                <span slot="title">SPU台账</span>
              </el-menu-item>
              <el-menu-item index="2-2" disabled>
                <i class="el-icon-circle-plus"></i>
                <span slot="title">新增SPU</span>
              </el-menu-item>
              <el-menu-item index="/sys-admin/product/album">
                <i class="el-icon-picture"></i>
                <span slot="title">相册管理</span>
              </el-menu-item>
              <el-menu-item index="/sys-admin/product/category">
                <i class="el-icon-s-unfold"></i>
                <span slot="title">商品类别</span>
              </el-menu-item>
              <el-menu-item index="/sys-admin/product/attribute-template">
                <i class="el-icon-s-flag"></i>
                <span slot="title">属性模板</span>
              </el-menu-item>
              <el-menu-item index="2-6" disabled>
                <i class="el-icon-s-ticket"></i>
                <span slot="title">属性管理</span>
              </el-menu-item>
              <el-menu-item index="/sys-admin/product/brand">
                <i class="el-icon-s-data"></i>
                <span slot="title">品牌管理</span>
              </el-menu-item>
            </el-submenu>
            <!-- 订单管理 -->
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index="4-1" disabled>
                <i class="el-icon-error"></i>
                <span slot="title">暂无内容</span>
              </el-menu-item>
            </el-submenu>
            <!-- 营销管理 -->
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-s-management"></i>
                <span>营销管理</span>
              </template>
              <el-menu-item index="5-1" disabled>
                <i class="el-icon-error"></i>
                <span slot="title">暂无内容</span>
              </el-menu-item>
            </el-submenu>
            <!-- 商家管理 -->
            <el-submenu index="6">
              <template slot="title">
                <i class="el-icon-s-shop"></i>
                <span>商家管理</span>
              </template>
              <el-menu-item index="6-1" disabled>
                <i class="el-icon-error"></i>
                <span slot="title">暂无内容</span>
              </el-menu-item>
            </el-submenu>
            <!-- 权限管理 -->
            <el-submenu index="7">
              <template slot="title">
                <i class="el-icon-s-check"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="/sys-admin/permission/admin">
                <i class="el-icon-s-custom"></i>
                <span slot="title">管理员管理</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 下半部分的右侧：主体 -->
        <el-main class="layout-main">
          <!-- 将由其它视图组件来显示 -->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenuItemPath: ''
    };
  },
  methods: {
    handleActiveMenuItem() {
      let currentPath = this.$router.currentRoute.path;
      if (currentPath.startsWith('/sys-admin/product/album')) {
        currentPath = '/sys-admin/product/album';
      }
      if (currentPath.startsWith('/sys-admin/product/brand')) {
        currentPath = '/sys-admin/product/brand';
      }
      if (currentPath.startsWith('/sys-admin/product/attribute-template')) {
        currentPath = '/sys-admin/product/attribute-template';
      }
      if (currentPath.startsWith('/sys-admin/permission/admin')) {
        currentPath = '/sys-admin/permission/admin';
      }
      this.activeMenuItemPath = currentPath;
    }
  },
  mounted() {
    this.handleActiveMenuItem();
  }
}
</script>

<style>
.layout-header {
  background: #2c3e50;
}

.layout-header h1 {
  line-height: 60px;
  color: #fff;
}

.layout-header .login-user {
  float: right;
  display: flex;
  margin-top: 16px;
}

.layout-header .login-user .welcome {
  line-height: 28px;
  color: #fff;
}

.layout-body {
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
}

.layout-aside {
  background: #222;
}

.layout-aside .el-menu {
  border: 0;
}

.layout-aside i {
  color: #fff !important;
}

.el-menu-item.is-active {
  background: #2c3e50 !important;
}

.layout-main {
  background-color: #fff;
}
</style>