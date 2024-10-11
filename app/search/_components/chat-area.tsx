"use client"

import { Input } from "@/components/ui/input"
import { SelectMessage, SelectSource } from "@/db/schema"
import { Search } from "lucide-react"

interface ChatAreaProps {
  initialMessages: SelectMessage[]
  initialSources: SelectSource[]
  chatId?: string
  userId?: string
}

export default function ChatArea({
  initialMessages,
  initialSources,
  chatId,
  userId
}: ChatAreaProps) {
  return (
    <div className={`flex h-full flex-col items-center justify-center`}>
      <div className="w-full max-w-2xl px-4">
        <p className="mb-4 text-center text-3xl font-semibold text-white">
          Ask anything
        </p>
        <div className="relative">
          <Input className="pr-10" placeholder="Type your question..." />
          <Search className="text-muted-foreground absolute right-3 top-1/2 size-5 -translate-y-1/2" />
        </div>
      </div>
    </div>
  )
}
