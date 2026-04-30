import { AgentsView } from '@/modules/agents/ui/views/agent-view'
import { HydrateClient, prefetch, trpc } from '@/trpc/server'


const Page = async () => {

  prefetch(
    trpc.agent.getMany.queryOptions()
  )

  return (
    <HydrateClient>
      <AgentsView />
    </HydrateClient>
  )
}

export default Page