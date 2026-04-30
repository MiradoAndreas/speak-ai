"use client"

import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { DataTable } from "../components/data-table"
import { columns, Payment } from "../components/columns"
import { EmptyState } from "@/components/empty-state"




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
    trpc.agents.getMany.queryOptions()
  )
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable data={data} columns={columns} />
      {data.length === 0 && (
        <EmptyState title="Create your first agent" description="Create an agent to join your meetings. Each agent will follow your instructions and cna interact with participants during the call" />
      )}
    </div>
  )
}
