import { createBrowserRouter } from 'react-router-dom'
import { ErrorPage } from '@/components'
import { processRoutes, type RouteConfig } from './guards'
import Index from '@/pages/Index'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Dev from '@/pages/dev'

// 路由配置数组，使用 meta 字段定义权限
const routeConfigs: RouteConfig[] = [
  {
    path: '/',
    element: <Index />,
    meta: {
      title: '首页',
      requiresAuth: false, // 公开路由，不需要登录
    },
  },
  {
    path: '/home',
    element: <Home />,
    meta: {
      title: '主页',
      // requiresAuth: false,
    },
  },
  {
    path: '/login',
    element: <Login />,
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/dev',
    element: <Dev />,
    meta: {
      title: '开发',
      requiresAuth: false,
    },
  },
  {
    path: '*',
    element: <ErrorPage status="404" />,
  },
]

// 处理路由配置，自动添加 loader 守卫和全局错误边界
const processedRoutes = processRoutes(routeConfigs)

// 创建路由实例
const router = createBrowserRouter(processedRoutes)

export default router

