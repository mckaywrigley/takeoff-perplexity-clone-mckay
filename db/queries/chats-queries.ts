"use server"

import { db } from "@/db/db"
import { chatsTable, InsertChat, SelectChat } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getChatsByUserId = async (
  userId: string
): Promise<SelectChat[]> => {
  try {
    return db.query.chats.findMany({
      where: eq(chatsTable.userId, userId),
      orderBy: (chats, { desc }) => [desc(chats.createdAt)]
    })
  } catch (error) {
    console.error("Error getting chats:", error)
    throw new Error("Failed to get chats")
  }
}

export const createChat = async (data: InsertChat): Promise<SelectChat> => {
  try {
    const [newChat] = await db.insert(chatsTable).values(data).returning()
    return newChat
  } catch (error) {
    console.error("Error creating chat:", error)
    throw new Error("Failed to create chat")
  }
}

export const deleteChat = async (id: string): Promise<void> => {
  try {
    await db.delete(chatsTable).where(eq(chatsTable.id, id))
  } catch (error) {
    console.error("Error deleting chat:", error)
    throw new Error("Failed to delete chat")
  }
}
