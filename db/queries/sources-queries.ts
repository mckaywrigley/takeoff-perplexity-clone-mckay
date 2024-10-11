"use server"

import { db } from "@/db/db"
import { InsertSource, SelectSource, sourcesTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export const createSources = async (
  data: InsertSource[]
): Promise<SelectSource[]> => {
  try {
    const newSources = await db.insert(sourcesTable).values(data).returning()
    return newSources
  } catch (error) {
    console.error("Error creating sources:", error)
    throw new Error("Failed to create sources")
  }
}

export const getSourcesByChatId = async (
  chatId: string
): Promise<SelectSource[]> => {
  try {
    return db.query.sources.findMany({
      where: eq(sourcesTable.chatId, chatId),
      orderBy: (sources, { asc }) => [asc(sources.createdAt)]
    })
  } catch (error) {
    console.error("Error getting sources:", error)
    throw new Error("Failed to get sources")
  }
}
