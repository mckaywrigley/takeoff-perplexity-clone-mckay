"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ChatArea from "./_components/chat-area"

export default async function SearchPage() {
  const { userId } = auth()

  if (!userId) {
    return redirect("/login")
  }

  return (
    <div className="h-full">
      <ChatArea userId={userId} initialSources={[]} initialMessages={[]} />
    </div>
  )
}
