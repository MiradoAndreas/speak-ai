import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/modules/meetings/meetings-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"


const Page = () => {
  prefetch(
    trpc.meetings.getMany.queryOptions({})
  )

  return (
    <HydrateClient>
      <Suspense fallback={<MeetingsViewLoading />}>
        <ErrorBoundary fallback={<MeetingsViewError />}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  )
}

export default Page