import { useState } from 'react'
import { Dialog, Chat, Header, type ChatMessage } from '@/components'
import { processImage, processVideo, getVideoResultUrl } from '@/server/video'
import { useMessage } from '@/hooks'
import './index.css'

const Home = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messageApi = useMessage()
  const hasStarted = messages.length > 0

  const createFormData = (file: File, normalMode: boolean, perturbProb: number | null) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('perturb_prob', String(perturbProb ?? 0.01))
    formData.append('visual_debug', normalMode as unknown as string)
    return formData
  }

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message])
  }

  const handleSendFile = async (file: File, normalMode: boolean, perturbProb: number | null) => {
    const isVideo = file.type.startsWith('video/')
    
    if (isVideo) {
      // Add user message with empty URL first
      const userMessageId = `user-${Date.now()}`
      addMessage({
        id: userMessageId,
        type: 'user',
        mediaUrl: URL.createObjectURL(file),
        mediaType: 'video',
        timestamp: Date.now()
      })

      try {
        const response = await processVideo(createFormData(file, normalMode, perturbProb))
        const taskId = response.task_id

        if (!taskId) {
          throw new Error('获取任务 ID 失败')
        }

        // Add AI message with loading state
        const aiMessageId = `ai-${Date.now()}`
        addMessage({
          id: aiMessageId,
          type: 'ai',
          mediaUrl: '',
          mediaType: 'video',
          timestamp: Date.now()
        })

        const eventSource = new EventSource(`/api/video_progress/${taskId}`)
        
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            
            if (data.status === 'error') {
              eventSource.close()
              messageApi.error(data.error || '视频处理失败')
              setMessages(prev => prev.filter(msg => msg.id !== aiMessageId))
              throw new Error(data.error || '处理失败')
            }
            
            if (data.status === 'completed') {
              eventSource.close()
              setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId 
                  ? { ...msg, mediaUrl: getVideoResultUrl(taskId) }
                  : msg
              ))
              messageApi.success('视频处理完成')
            }
          } catch (e) {
            console.error('解析数据失败:', e, event.data)
            messageApi.error('解析数据失败')
          }
        }
        
        eventSource.onerror = () => {
          eventSource.close()
          messageApi.error('连接错误，请刷新重试')
        }
      } catch (error) {
        console.error('视频处理失败:', error)
        messageApi.error(error instanceof Error ? error.message : '视频处理失败')
      }
    } else {
      addMessage({
        id: `user-${Date.now()}`,
        type: 'user',
        mediaUrl: URL.createObjectURL(file),
        mediaType: 'image',
        timestamp: Date.now()
      })

      try {
        const blob = await processImage(createFormData(file, normalMode, perturbProb))
        addMessage({
          id: `ai-${Date.now()}`,
          type: 'ai',
          mediaUrl: URL.createObjectURL(blob),
          mediaType: 'image',
          timestamp: Date.now()
        })
        messageApi.success('图片处理完成')
      } catch (error) {
        console.error('图片处理失败:', error)
        messageApi.error(error instanceof Error ? error.message : '图片处理失败')
      }
    }
  }

  return (
    <div className="home-page">
      <Header />
      
      <Chat messages={messages} hasStarted={hasStarted} />

      <div className={`home-dialog-wrapper ${hasStarted ? 'home-dialog-started' : 'home-dialog-centered'}`}>
        <Dialog onSend={handleSendFile} hasStarted={hasStarted} />
      </div>
    </div>
  )
}

export default Home
