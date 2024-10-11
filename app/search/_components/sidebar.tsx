"use client"

import { createChatAction, deleteChatAction } from "@/actions/db/chats-actions"
import { Button } from "@/components/ui/button"
import { SelectChat } from "@/db/schema"
import { Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface SidebarProps {
  className?: string
  userId: string
  initialChats: SelectChat[]
}

export default function Sidebar({
  className,
  userId,
  initialChats
}: SidebarProps) {
  const [chats, setChats] = useState(initialChats)

  const handleNewChat = async () => {
    const result = await createChatAction(userId, "New Chat")
    if (result.isSuccess && result.data) {
      setChats([result.data, ...chats])
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    const result = await deleteChatAction(chatId)
    if (result.isSuccess) {
      setChats(chats.filter(chat => chat.id !== chatId))
    }
  }

  return (
    <aside className={`bg-neutral-100 p-4 ${className}`}>
      <Button
        onClick={handleNewChat}
        className="mb-4 flex w-full items-center justify-center bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
      >
        <Plus className="mr-2 size-4" /> New Search
      </Button>
      <h2 className="mb-4 text-lg font-semibold text-neutral-800">Chats</h2>
      {chats.map(chat => (
        <div
          key={chat.id}
          className="group mb-2 flex items-center justify-between text-neutral-700"
        >
          <Link href={`/search/${chat.id}`} className="grow">
            <span>{chat.name}</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="invisible group-hover:visible"
            onClick={() => handleDeleteChat(chat.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </aside>
  )
}
