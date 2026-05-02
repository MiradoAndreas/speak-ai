import { auth } from "@/lib/auth"
import { MeetingIdView, MeetingIdViewError, MeetingIdViewLoading } from "@/modules/agents/ui/views/meeting-id-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface Props {
  params: Promise<{
    meetingId: string
  }>
}

const Page = async ({ params }: Props) => {
  const { meetingId } = await params
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
    redirect("/sign-in")
  }
  prefetch(
    trpc.meetings.getOne.queryOptions({
      id: meetingId
    })
  )
  // TODO: Prefetch 'meetings.getTranscript'
  return (
    <>
      <HydrateClient>
        <Suspense fallback={<MeetingIdViewLoading />}>
          <ErrorBoundary fallback={<MeetingIdViewError />}>
            <MeetingIdView meetingId={meetingId} />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </>
  )
}

export default Page