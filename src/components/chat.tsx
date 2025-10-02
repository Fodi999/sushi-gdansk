'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  MessageCircle, 
  Send, 
  User, 
  Bot, 
  Clock,
  CheckCircle2
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'support'
  timestamp: Date
  status?: 'sent' | 'delivered' | 'read'
}

interface ChatProps {
  className?: string
}

export function Chat({ className }: ChatProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Добро пожаловать в службу поддержки Суши Город! Как мы можем вам помочь?',
      sender: 'support',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'read'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Симуляция ответа поддержки
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoResponse(newMessage),
        sender: 'support',
        timestamp: new Date(),
        status: 'delivered'
      }
      setMessages(prev => [...prev, supportMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const getAutoResponse = (userText: string): string => {
    const text = userText.toLowerCase()
    
    if (text.includes('заказ') || text.includes('доставка')) {
      return 'Для получения информации о заказе, пожалуйста, укажите номер заказа. Вы можете найти его в разделе "Мои заказы".'
    }
    
    if (text.includes('меню') || text.includes('блюда')) {
      return 'Наше полное меню доступно на странице "Меню". У нас есть роллы, суши, горячие блюда и напитки.'
    }
    
    if (text.includes('время') || text.includes('работа')) {
      return 'Мы работаем ежедневно с 10:00 до 23:00. Доставка осуществляется до 22:30.'
    }
    
    if (text.includes('оплата') || text.includes('карта')) {
      return 'Мы принимаем оплату наличными при получении, банковскими картами и онлайн-платежи на сайте.'
    }
    
    if (text.includes('привет') || text.includes('здравствуй')) {
      return `Привет, ${session?.user?.name || 'дорогой клиент'}! Рады вас видеть. Чем можем помочь?`
    }
    
    return 'Спасибо за ваше сообщение! Наш специалист ответит вам в ближайшее время. Если у вас срочный вопрос, позвоните нам по телефону +7 (999) 123-45-67.'
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Чат с поддержкой
          </span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-600">
              {isOnline ? 'Онлайн' : 'Оффлайн'}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          Задайте вопрос нашей службе поддержки
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Область сообщений */}
        <div className="h-80 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50/50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white border'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'support' && (
                      <Bot className="h-4 w-4 mt-0.5 text-orange-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs ${
                            message.sender === 'user'
                              ? 'text-orange-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                        {message.sender === 'user' && (
                          <div className="flex items-center">
                            {message.status === 'sent' && (
                              <Clock className="h-3 w-3 text-orange-200" />
                            )}
                            {message.status === 'delivered' && (
                              <CheckCircle2 className="h-3 w-3 text-orange-200" />
                            )}
                            {message.status === 'read' && (
                              <CheckCircle2 className="h-3 w-3 text-green-300" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Индикатор печати */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-lg p-3 max-w-[70%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-orange-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Поле ввода */}
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите ваше сообщение..."
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || isTyping}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Быстрые ответы */}
        <div className="mt-4">
          <p className="text-xs text-gray-600 mb-2">Быстрые вопросы:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Статус заказа',
              'Время доставки',
              'Способы оплаты',
              'Меню'
            ].map((question) => (
              <Badge
                key={question}
                variant="outline"
                className="cursor-pointer hover:bg-orange-50 hover:border-orange-200 text-xs"
                onClick={() => setNewMessage(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
