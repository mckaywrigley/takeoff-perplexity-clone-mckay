"use server"

import { db } from "@/db/db"
import { InsertMessage, messagesTable, SelectMessage } from "@/db/schema"
import { eq } from "drizzle-orm"

export const createMessage = async (
  data: InsertMessage
): Promise<SelectMessage> => {
  try {
    const [newMessage] = await db.insert(messagesTable).values(data).returning()
    return newMessage
  } catch (error) {
    console.error("Error creating message:", error)
    throw new Error("Failed to create message")
  }
}

export const getMessagesByChatId = async (
  chatId: string
): Promise<SelectMessage[]> => {
  try {
    return db.query.messages.findMany({
      where: eq(messagesTable.chatId, chatId),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)]
    })
  } catch (error) {
    console.error("Error getting messages:", error)
    throw new Error("Failed to get messages")
  }
}
