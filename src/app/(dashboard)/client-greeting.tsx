'use client';

import { useTRPC } from '@/trpc/client';
// <-- hooks can only be used in client components
import { useQuery } from '@tanstack/react-query';


export function ClientGreeting() {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions({ text: 'World' }));
  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data.greeting}</div>;
}