import { AgentIdView, AgentIdViewError, AgentIdViewLoading } from "@/modules/agents/ui/views/agent-id-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"


interface Props {
  params: Promise<{
    agentId: string
  }>
}

const Page = async ({ params }: Props) => {
  const { agentId } = await params
  prefetch(
    trpc.agents.getOne.queryOptions({
      id: agentId
    })
  )
  return (
    <>
      <HydrateClient>
        <Suspense fallback={<AgentIdViewLoading />}>
          <ErrorBoundary fallback={<AgentIdViewError />}>
            <AgentIdView agentId={agentId} />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </>
  )
}

export default Page