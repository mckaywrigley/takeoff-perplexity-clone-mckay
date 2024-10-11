"use client"

import { createChatAction } from "@/actions/db/chats-actions"
import { createMessageAction } from "@/actions/db/messages-actions"
import { createSourcesAction } from "@/actions/db/sources-actions"
import { searchExaAction } from "@/actions/exa-actions"
import { generateOpenAIResponseAction } from "@/actions/openai-actions"
import { Input } from "@/components/ui/input"
import { SelectMessage, SelectSource } from "@/db/schema"
import { readStreamableValue } from "ai/rsc"
import { Search } from "lucide-react"
import { KeyboardEvent, useState } from "react"

interface ChatAreaProps {
  initialMessages: SelectMessage[]
  initialSources: SelectSource[]
  userId: string
}

export default function ChatArea({
  initialMessages,
  initialSources,
  userId
}: ChatAreaProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [sources, setSources] = useState(initialSources)
  const [isSearching, setIsSearching] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const handleSearch = async (query: string) => {
    setIsSearching(true)

    let currentChatId = "temp-chat-id"
    let isNewChat = true

    const userMessageId = Date.now().toString()
    const assistantMessageId = Date.now().toString() + 1

    setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: query,
        chatId: currentChatId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: assistantMessageId,
        role: "assistant",
        content: "Searching for information...",
        chatId: currentChatId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    const exaResponse = await searchExaAction(query)
    if (!exaResponse.isSuccess) {
      console.error(exaResponse.message)
      setIsSearching(false)
      return
    }
    console.log(exaResponse.data)

    setSources(
      (exaResponse.data || []).map((result, idx) => ({
        id: `${idx}-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        chatId: currentChatId,
        ...result
      }))
    )

    setIsSearching(false)
    setIsGenerating(true)

    const openaiResponse = await generateOpenAIResponseAction(query, sources)
    if (!openaiResponse.isSuccess || !openaiResponse.data) {
      console.error(openaiResponse.message)
      setIsGenerating(false)
      return
    }

    setIsGenerating(false)

    let fullContent = ""
    try {
      for await (const chunk of readStreamableValue(openaiResponse.data)) {
        if (chunk) {
          fullContent += chunk
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullContent }
                : msg
            )
          )
        }
      }
    } catch (error) {
      console.error("Error generating full response:", error)
    }

    if (isNewChat) {
      console.log("Creating new chat", userId)
      const newChat = await createChatAction(userId, query.slice(0, 50))
      if (newChat.isSuccess) {
        currentChatId = newChat.data?.id || ""
        isNewChat = false
      } else {
        console.error(newChat.message)
      }
    }

    const userMessageResult = await createMessageAction({
      chatId: currentChatId,
      content: query,
      role: "user"
    })

    const assistantMessageResult = await createMessageAction({
      chatId: currentChatId,
      content: fullContent,
      role: "assistant"
    })

    const sourcesResult = await createSourcesAction(
      exaResponse.data?.map(result => ({
        ...result,
        chatId: currentChatId
      })) || []
    )
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSearch(inputValue.trim())
      setInputValue("")
    }
  }

  return (
    <div className="flex h-full flex-col items-center">
      <div className="mt-8 w-full max-w-3xl px-4">
        {messages.length === 0 ? (
          <div className="mb-8">
            <p className="mb-4 text-center text-3xl font-semibold text-white">
              Ask anything
            </p>
            <div className="relative">
              <Input
                className="pr-10"
                placeholder="Type your question..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Search className="text-muted-foreground absolute right-3 top-1/2 size-5 -translate-y-1/2" />
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={msg.id} className="mb-4">
              {msg.role === "user" && (
                <div className="mb-2 text-xl font-semibold text-white">
                  {msg.content}
                </div>
              )}
              {msg.role === "user" && index === messages.length - 2 && (
                <div className="mb-4 overflow-x-auto pb-2">
                  <div className="flex gap-2">
                    {sources.map(source => (
                      <a
                        key={source.id}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-40 shrink-0 flex-col justify-between rounded-lg bg-gray-800 p-3 transition-colors hover:bg-gray-700"
                      >
                        <div className="text-sm font-medium text-white">
                          {source.title}
                        </div>
                        <div className="truncate text-xs text-gray-400">
                          {source.url}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {msg.role === "assistant" && (
                <div className="text-gray-300">{msg.content}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
