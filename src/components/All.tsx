import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

interface ErrorPageProps {
  status: '403' | '404' | '500'
  title?: string
  subTitle?: string
  extra?: React.ReactNode
}

// 默认配置
const defaultConfig: Record<'403' | '404' | '500', { title: string; subTitle: string }> = {
  '403': {
    title: '403',
    subTitle: '抱歉，您没有权限访问此页面。',
  },
  '404': {
    title: '404',
    subTitle: '抱歉，您访问的页面不存在。',
  },
  '500': {
    title: '500',
    subTitle: '抱歉，服务器出现了错误。',
  },
}

const ErrorPage: React.FC<ErrorPageProps> = ({ status, title, subTitle, extra }) => {
  const navigate = useNavigate()
  const config = defaultConfig[status]

  const defaultExtra = (
    <Button type="primary" onClick={() => navigate('/')}>
      返回首页
    </Button>
  )

  return (
    <Result
      status={status}
      title={title ?? config.title}
      subTitle={subTitle ?? config.subTitle}
      extra={extra ?? defaultExtra}
    />
  )
}

export default ErrorPage