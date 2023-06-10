import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: HomeView,
    children: [
      {
        path: '/sys-admin/product/album/add-new',
        component: () => import('../views/sys-admin/product/AlbumAddNewView.vue')
      },
      {
        path: '/sys-admin/product/album',
        component: () => import('../views/sys-admin/product/AlbumListView.vue')
      },
      {
        path: '/sys-admin/product/brand/add-new',
        component: () => import('../views/sys-admin/product/BrandAddNewView.vue')
      },
      {
        path: '/sys-admin/product/brand',
        component: () => import('../views/sys-admin/product/BrandListView.vue')
      },
      {
        path: '/sys-admin/product/attribute-template/add-new',
        component: () => import('../views/sys-admin/product/AttributeTemplateAddNewView.vue')
      },
      {
        path: '/sys-admin/product/attribute-template',
        component: () => import('../views/sys-admin/product/AttributeTemplateListView.vue')
      },
      {
        path: '/sys-admin/product/category',
        component: () => import('../views/sys-admin/product/CategoryListView.vue')
      },
      // ======================== 权限管理 ========================
      {
        path: '/sys-admin/permission/admin/add-new',
        component: () => import('../views/sys-admin/permission/AdminAddNewView')
      },
      {
        path: '/sys-admin/permission/admin',
        component: () => import('../views/sys-admin/permission/AdminListView')
      },
      {
        path: '/sys-admin/permission/admin/update',
        component: () => import('../views/sys-admin/permission/AdminUpdateNewView')
      },
    ]
  },
  {
    path: '/about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/login',
    component: () => import('../views/LoginView.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
