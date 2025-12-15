import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { message } from 'antd'
import router from './router'
import { MessageContext } from '@/hooks'
import request from './server/request'

function App() {
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    // 初始化 request 的 message API
    request.setMessageApi(messageApi)
  }, [messageApi])

  return (
    <MessageContext.Provider value={messageApi}>
      {contextHolder}
      <RouterProvider router={router} />
    </MessageContext.Provider>
  )
}

export default App
