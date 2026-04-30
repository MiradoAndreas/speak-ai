"use client"

import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"




export const AgentsView = () => {
  return (
    <Suspense fallback={<LoadingState title="Loading..." description="Please wait while we fetch your data" />}>
      <ErrorBoundary fallback={<ErrorState title="Oops! Something went wrong" description="Please try again later" />}>
        <AgentsViewSuspense />
      </ErrorBoundary>
    </Suspense>
  )
}

const AgentsViewSuspense = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(
    trpc.agent.getMany.queryOptions()
  )


  return (
    <div>
      {JSON.stringify(data, null, 2)}
    </div>
  )
}
