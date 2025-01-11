import { useState, useRef, useEffect } from 'react'
import styles from '@/styles/GeminiChat.module.css'
import { GeminiService } from '@/utils/gemini'
import { FileUploader } from './FileUploader'

interface Message {
  role: 'user' | 'assistant'
  content: string
  attachments?: {
    type: string
    url: string
    name: string
  }[]
}

interface GeminiChatProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string
}

interface TypingMessage extends Message {
  isTyping?: boolean;
  fullContent?: string;
}

const GeminiChat = ({ isOpen, onClose, apiKey }: GeminiChatProps) => {
  const [messages, setMessages] = useState<TypingMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateTyping = async (content: string) => {
    const typingSpeed = 30 // milliseconds per character
    let currentIndex = 0

    const newMessage: TypingMessage = {
      role: 'assistant',
      content: '',
      isTyping: true,
      fullContent: content
    }

    setMessages(prev => [...prev, newMessage])

    const typeNextChar = () => {
      if (!newMessage.fullContent) return;
      
      if (currentIndex < newMessage.fullContent.length) {
        setMessages(prev => prev.map((msg, i) => {
          if (i === prev.length - 1) {
            return {
              ...msg,
              content: newMessage.fullContent!.slice(0, currentIndex + 1)
            }
          }
          return msg
        }))
        currentIndex++
        setTimeout(typeNextChar, typingSpeed)
      } else {
        setMessages(prev => prev.map((msg, i) => {
          if (i === prev.length - 1) {
            return {
              ...msg,
              isTyping: false
            }
          }
          return msg
        }))
      }
    }

    typeNextChar()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const gemini = new GeminiService(apiKey)
      const response = await gemini.chat(userMessage)
      await simulateTyping(response)
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (uploadedFiles: File[]) => {
    setIsUploading(true)
    try {
      const attachments: Array<{
        data: Uint8Array;
        mimeType: string;
      }> = [];

      for (const file of uploadedFiles) {
        if (file.type.startsWith('image/')) {
          // Handle image files
          const imageData = await readFileAsBase64(file)
          attachments.push({
            data: imageData,
            mimeType: 'image'
          })
        } else if (file.type === 'application/pdf') {
          // Handle PDF files
          const pdfText = await extractTextFromPDF(file)
          attachments.push({
            data: pdfText,
            mimeType: 'pdf'
          })
        }
      }
      
      setFiles(uploadedFiles)
      // Add file message to chat
      if (attachments.length > 0) {
        setMessages(prev => [...prev, {
          role: 'user',
          content: `Uploaded ${attachments.length} file(s)`,
          attachments
        }])
        
        // Analyze files with Gemini
        const gemini = new GeminiService(apiKey)
        const response = await gemini.analyzeFiles(attachments)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response
        }])
      }
    } catch (error) {
      console.error('File upload error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing the files.'
      }])
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.chatOverlay}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <h2>Chat with Gemini</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className={styles.messagesContainer}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`${styles.message} ${styles[message.role]}`}
            >
              <div className={styles.messageContent}>
                {message.attachments && (
                  <div className={styles.attachments}>
                    {message.attachments.map((attachment, i) => (
                      <div key={i} className={styles.attachment}>
                        <i className={`fas fa-${attachment.type === 'pdf' ? 'file-pdf' : 'image'}`} />
                        <span>{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                {message.content}
                {message.isTyping && (
                  <span className={styles.typingCursor}></span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <div className={styles.inputWrapper}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className={styles.input}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <FileUploader 
              onUpload={handleFileUpload}
              isUploading={isUploading}
              accept=".pdf,image/*"
            />
          </div>
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={isLoading || (!input.trim() && files.length === 0)}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  )
}

export default GeminiChat 