import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入需要的路由组件
const Login = () => import('@/views/Login/Login.vue')
const Home = () => import('@/views/Home/Home.vue')
const Select = () => import('@/components/system/Article/Select.vue')
const Add = () => import('@/components/system/Article/Add.vue')
const Comment = () => import('@/components/system/Comment.vue')
const Type = () => import('@/components/system/Type.vue')
const Tag = () => import('@/components/system/Tag.vue')
const View = () => import('@/components/system/View.vue')
const Welcome = () => import('@/views/Welcome/Welcome.vue')
const BlogIndex = () => import('@/components/blog/BlogIndex.vue')
const BlogType = () => import('@/components/blog/BlogType.vue')
const BlogArchive = () => import('@/components/blog/BlogArchive.vue')
const Detail = () => import('@/components/blog/Detail.vue')
const BlogTag = () => import('@/components/blog/BlogTag.vue')

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/', component: Welcome, redirect: '/index',
    children: [
      { path: 'index', component: BlogIndex, meta: { keepAlive: true, title: '张博的博客' } },
      { path: 'type', component: BlogType, meta: { title: '分类' } },
      { path: 'tag', component: BlogTag, meta: { title: '标签' } },
      { path: 'archive', component: BlogArchive, meta: { keepAlive: true, title: '归档' } },
      { path: 'detail', component: Detail, meta: { keepAlive: true } },
    ]
  },
  // 带有 name 名称的路由规则，叫做“命名路由”
  { path: '/zblogin', component: Login, name: 'login', meta: { title: '登录' } },
  /* // 注册页面
  { path: '/register', component: Register, name: 'register' }, */
  {
    path: '/home', component: Home, name: 'home', redirect: '/home/view',
    children: [
      { path: 'view', component: View, meta: { title: '视图' } },
      { path: 'select', component: Select, meta: { title: '文章管理' } },
      { path: 'add', component: Add, meta: { title: '文章添加' } },
      { path: 'comment', component: Comment, meta: { title: '评论' } },
      { path: 'type', component: Type, meta: { title: '分类管理' } },
      { path: 'tag', component: Tag, meta: { title: '标签管理' } }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.path.slice(0, 5) === '/home') {
    const state = JSON.parse(localStorage.getItem('state'))
    if (state && state.tokenInfo) {
      next()
    } else {
      next('/zblogin')
    }
  } else next()
})

export default router
