import { auth } from "@/lib/auth"
import { loadSearchParams } from "@/modules/meetings/params"
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header"
import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/modules/meetings/ui/views/meetings-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface Props {
  searchParams: Promise<SearchParams>
}


const Page = async ({ searchParams }: Props) => {
  const filters = await loadSearchParams(searchParams)
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
    redirect("/sign-in")
  }
  prefetch(
    trpc.meetings.getMany.queryOptions({
      ...filters
    })
  )

  return (
    <>
      <MeetingsListHeader />
      <HydrateClient>
        <Suspense fallback={<MeetingsViewLoading />}>
          <ErrorBoundary fallback={<MeetingsViewError />}>
            <MeetingsView />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient></>
  )
}

export default Page