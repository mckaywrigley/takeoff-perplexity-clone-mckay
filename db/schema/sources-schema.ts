import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { chatsTable } from "./chats-schema"

export const sourcesTable = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: uuid("chat_id")
    .references(() => chatsTable.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  text: text("text").notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertSource = typeof sourcesTable.$inferInsert
export type SelectSource = typeof sourcesTable.$inferSelect
