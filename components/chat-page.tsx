"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// OpenAI API service
import { openAIApiService } from "@/lib/openai-api"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call the OpenAI API
      const response = await openAIApiService.generateResponse(input)

      // Add AI response
      const aiMessage: Message = {
        id: generateId(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)
      toast({
        title: "Error",
        description: "Failed to get a response from the AI. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Assistant</h2>
        <p className="text-muted-foreground">Chat with our AI assistant to get help with your shop management</p>
      </div>

      <div className="grid h-[calc(100vh-20rem)] grid-rows-[1fr,auto]">
        <Card className="h-full">
          <CardHeader className="px-4 py-2 border-b">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-md">Shop Assistant</CardTitle>
                <CardDescription className="text-xs">Powered by OpenAI</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 h-full overflow-y-auto">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Icons.shoppingBag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground">No messages yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask the AI for help with inventory management, sales strategies, customer service, or any other
                    shop-related questions.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start gap-3 rounded-lg p-3",
                      message.role === "user"
                        ? "bg-primary/5 flex-row-reverse ml-6"
                        : "bg-muted/40 mr-6"
                    )}
                  >
                    <Avatar className="h-8 w-8 mt-1">
                      {message.role === "user" ? (
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">U</AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="prose prose-sm">
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                        }).format(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-2 border-t">
            <div className="flex w-full items-center gap-2">
              <Textarea
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-10 flex-1 resize-none"
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="h-10 w-10"
              >
                {isLoading ? (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                  <Icons.arrowRight className="h-4 w-4" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}