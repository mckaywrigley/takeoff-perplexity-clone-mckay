"use server"

import { getChatsByUserIdAction } from "@/actions/db/chats-actions"
import { auth } from "@clerk/nextjs/server"
import { Suspense } from "react"
import Sidebar from "./_components/sidebar"
import SidebarSkeleton from "./_components/sidebar-skeleton"

export default async function SearchLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("User not authenticated")
  }

  return (
    <div className="flex h-screen">
      <Suspense fallback={<SidebarSkeleton />}>
        <SidebarFetcher userId={userId} />
      </Suspense>
      <main className="flex-1">{children}</main>
    </div>
  )
}

async function SidebarFetcher({ userId }: { userId: string }) {
  const { data: chats } = await getChatsByUserIdAction(userId)

  return (
    <Sidebar
      className="w-64 border-r"
      userId={userId}
      initialChats={chats || []}
    />
  )
}
