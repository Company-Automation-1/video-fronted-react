import type React from 'react'
import { redirect, type LoaderFunctionArgs, type RouteObject } from 'react-router-dom'
import { useAuthStore } from '../store'
import ErrorBoundary from '@/pages/ErrorBoundary'

/**
 * 路由元信息类型定义
 * 
 * @property requiresAuth 是否需要登录，false 为公开路由，true 或 undefined 需要登录
 * @property roles 允许访问的角色列表
 * @property title 路由标题
 */
export interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
    title?: string
}

/**
 * 扩展的路由对象类型，包含 meta 字段
 * 
 * @property path 路由路径
 * @property index 是否为索引路由
 * @property element 路由组件
 * @property meta 路由元信息
 * @property children 子路由
 * @property loader 路由加载器
 * @property action 路由动作
 * @property errorElement 路由错误元素
 * @property caseSensitive 是否区分大小写
 * @property id 路由ID
 */
export interface RouteConfig {
    path?: string
    index?: boolean
    element?: React.ReactElement | null
    meta?: RouteMeta
    children?: RouteConfig[]
    loader?: RouteObject['loader']
    action?: RouteObject['action']
    errorElement?: React.ReactElement | null
    caseSensitive?: boolean
    id?: string
}

/**
 * 创建路由守卫函数
 * @param meta 路由元信息
 * @returns loader 函数
 */
export function createAuthGuard(meta?: RouteMeta) {
    return ({ request }: LoaderFunctionArgs) => {
        const url = new URL(request.url)
        const pathname = url.pathname

        // requiresAuth 为 false 时不需要认证，为 true 或 undefined 时需要认证
        const needsAuth = meta?.requiresAuth !== false

        if (needsAuth) {
            const { token, userInfo } = useAuthStore.getState()
            if (!token) {
                // 未登录，重定向到登录页
                const redirectTo = encodeURIComponent(pathname + url.search)
                throw redirect(`/login?redirect=${redirectTo}`)
            }

            // 如果需要角色权限检查
            if (meta?.roles && meta.roles.length > 0) {
                const userRoles = userInfo?.roles
                const rolesArray = userRoles ? (Array.isArray(userRoles) ? userRoles : [userRoles]) : []
                const hasRole = meta.roles.some(role => rolesArray.includes(role))

                if (!hasRole) {
                    // 没有权限，抛出 403 错误
                    throw new Response('Forbidden', { status: 403 })
                }
            }
        }

        return null
    }
}

/**
 * 处理路由配置，自动为每个路由添加 loader 守卫和错误边界
 * @param routes 路由配置数组
 * @returns 处理后的路由数组
 */
export function processRoutes(routes: RouteConfig[]): RouteObject[] {
    return routes.map(route => {
        const { meta, children, ...routeProps } = route

        const processedRoute: RouteObject = {
            ...routeProps,
        } as RouteObject

        // 404 路由（path: '*'）不需要添加 loader，避免触发登录检查
        if (route.path !== '*') {
            processedRoute.loader = createAuthGuard(meta)
        }

        // 如果路由没有指定 errorElement，使用默认的错误边界
        if (!processedRoute.errorElement) {
            processedRoute.errorElement = <ErrorBoundary />
        }

        // 递归处理子路由
        if (children && children.length > 0) {
            processedRoute.children = processRoutes(children)
        }

        return processedRoute
    })
}

