"use client"

import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"

export const MeetingsView = () => {
  const trpc = useTRPC()
  const { data } = useQuery(
    trpc.meetings.getMany.queryOptions({})
  )
  return (
    <div>
      {JSON.stringify(data, null, 2)}
    </div>
  )
}


export const MeetingsViewLoading = () => {
  return (
    <LoadingState title="Loading..." description="Please wait while we fetch your data" />
  )
}

export const MeetingsViewError = () => {
  return (
    <ErrorState title="Error Loading Meetings" description="Someting went wrong" />
  )
}