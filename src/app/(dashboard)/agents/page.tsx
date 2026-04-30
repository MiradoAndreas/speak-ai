import { auth } from '@/lib/auth'
import { AgentsListHeader } from '@/modules/agents/ui/components/agents-list-header'
import { AgentsView } from '@/modules/agents/ui/views/agent-view'
import { HydrateClient, prefetch, trpc } from '@/trpc/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'


const Page = async () => {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  prefetch(
    trpc.agents.getMany.queryOptions()
  )

  return (
    <>
      <AgentsListHeader />
      <HydrateClient>
        <AgentsView />
      </HydrateClient>
    </>
  )
}

export default Page