import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter);

  const routes = [
  {path:'/',name:'default',redirect:'/index',component:()=>import('../views/index.vue')},//默认加载路由
  {path: '/index',name: 'index',component:()=>import('../views/index.vue')},//首页
  {path: '/my',name: 'my',component:()=>import('../views/my.vue')},//我的
  {path: '/login',name: 'login',component:()=>import('../views/logIn.vue')},//登录
  {path: '/winList',name: 'winList',component:()=>import('../views/winList.vue')},//窗口列表
  {path: '/winDetail',name: 'winDetail',component:()=>import('../views/winDetail.vue')},//窗口详情
  {path: '/orderList',name: 'orderList',component:()=>import('../views/orderList.vue')},//订单列表
  {path: '/pay',name: 'pay',component:()=>import('../views/pay.vue')},//支付
  {path: '/searchGoods',name: 'searchGoods',component:()=>import('../views/searchGoods.vue')},//搜索列表
];


const router = new VueRouter({
  routes
});



export default router;
