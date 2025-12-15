import { createContext, useContext } from 'react'
import type { MessageInstance } from 'antd/es/message/interface'

export const MessageContext = createContext<MessageInstance | null>(null)

export const useMessage = () => {
  const messageApi = useContext(MessageContext)
  if (!messageApi) {
    throw new Error('useMessage must be used within MessageProvider')
  }
  return messageApi
}

