"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function ChatAreaSkeleton() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-2xl px-4">
        <Skeleton className="mx-auto mb-4 h-10 w-3/4" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}
