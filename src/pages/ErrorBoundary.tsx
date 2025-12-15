import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { ErrorPage } from '@/components'

/**
 * 全局错误边界组件
 * 自动处理路由错误，包括 404、403、500 等
 */
const ErrorBoundary = () => {
  const error = useRouteError()

  // 处理路由错误响应
  if (isRouteErrorResponse(error)) {
    const status = error.status

    // 根据状态码返回对应的错误页
    if (status === 403) {
      return <ErrorPage status="403" />
    }

    if (status === 404) {
      return <ErrorPage status="404" />
    }

    if (status === 500) {
      return <ErrorPage status="500" />
    }

    // 其他错误状态
    return (
      <ErrorPage
        status="500"
        title={`${status}`}
        subTitle={error.statusText || '发生了未知错误'}
      />
    )
  }

  // 处理其他类型的错误
  if (error instanceof Error) {
    return (
      <ErrorPage
        status="500"
        title="错误"
        subTitle={error.message || '发生了未知错误'}
      />
    )
  }

  // 默认错误
  return <ErrorPage status="500" />
}

export default ErrorBoundary

