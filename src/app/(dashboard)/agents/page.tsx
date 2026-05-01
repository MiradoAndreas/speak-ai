import { auth } from '@/lib/auth'
import { loadSearchParams } from '@/modules/agents/params'
import { AgentsListHeader } from '@/modules/agents/ui/components/agents-list-header'
import { AgentsView } from '@/modules/agents/ui/views/agent-view'
import { HydrateClient, prefetch, trpc } from '@/trpc/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { SearchParams } from 'nuqs'

interface Props {
  searchParams: Promise<SearchParams>;
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
    trpc.agents.getMany.queryOptions({
      ...filters
    })
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