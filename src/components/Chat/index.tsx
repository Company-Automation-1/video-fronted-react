import { useRef, useEffect } from 'react'
import { IconSparkles, IconLoader } from '../Icons'
import './index.css'

export interface ChatMessage {
    id: string
    type: 'user' | 'ai'
    mediaUrl: string
    mediaType: 'image' | 'video'
    timestamp: number
}

interface ChatProps {
    messages: ChatMessage[]
    hasStarted: boolean
}

const Chat = ({ messages, hasStarted }: ChatProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    return (
        <div 
            ref={scrollRef}
            className={`chat-area ${hasStarted ? 'chat-visible' : 'chat-hidden'}`}
        >
            <div className="chat-messages">
                {messages.map((message) => (
                    <div key={message.id} className="chat-message-group">
                        {message.type === 'user' && (
                            <div className="chat-message-user">
                                <div className="chat-message-card chat-message-card-user">
                                    {message.mediaType === 'video' ? (
                                        <video src={message.mediaUrl} className="chat-media" controls />
                                    ) : (
                                        <img src={message.mediaUrl} alt="User upload" className="chat-media" />
                                    )}
                                </div>
                            </div>
                        )}

                        {message.type === 'ai' && (
                            <div className="chat-message-ai">
                                <div className="chat-ai-avatar">
                                    <IconSparkles className="chat-ai-icon" />
                                </div>
                                
                                <div className="chat-message-card chat-message-card-ai">
                                    {!message.mediaUrl ? (
                                        <div className="chat-loading-state">
                                            <IconLoader className="chat-loading-icon" />
                                            <span className="chat-loading-text">AI PROCESSING...</span>
                                        </div>
                                    ) : (
                                        message.mediaType === 'video' ? (
                                            <video src={message.mediaUrl} controls className="chat-media-result" />
                                        ) : (
                                            <img src={message.mediaUrl} alt="Result" className="chat-media-result" />
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Chat
