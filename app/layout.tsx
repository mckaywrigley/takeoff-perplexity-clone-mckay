import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/utilities/providers"
import {
  createProfile,
  getProfileByUserId
} from "@/db/queries/profiles-queries"
import { ClerkProvider } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Perplexity Clone",
  description: "A full-stack template for a Perplexity clone."
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()

  if (userId) {
    const profile = await getProfileByUserId(userId)
    if (!profile) {
      await createProfile({ userId })
    }
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Providers
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}

            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
