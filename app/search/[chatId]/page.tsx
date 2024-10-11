"use server"

import { getMessagesByChatIdAction } from "@/actions/db/messages-actions"
import { getSourcesByChatIdAction } from "@/actions/db/sources-actions"
import { auth } from "@clerk/nextjs/server"
import { Suspense } from "react"
import ChatArea from "../_components/chat-area"
import ChatAreaSkeleton from "../_components/chat-area-skeleton"

export default async function ChatPage({
  params
}: {
  params: { chatId: string }
}) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("User not authenticated")
  }

  return (
    <div className="h-full">
      <Suspense fallback={<ChatAreaSkeleton />}>
        <ChatAreaFetcher chatId={params.chatId} userId={userId} />
      </Suspense>
    </div>
  )
}

async function ChatAreaFetcher({
  chatId,
  userId
}: {
  chatId: string
  userId: string
}) {
  const { data: messages } = await getMessagesByChatIdAction(chatId)
  const { data: sources } = await getSourcesByChatIdAction(chatId)

  return (
    <ChatArea
      initialMessages={messages || []}
      initialSources={sources || []}
      userId={userId}
    />
  )
}
