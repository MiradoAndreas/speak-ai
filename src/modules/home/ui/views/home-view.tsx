"use client"

import { ClientGreeting } from "@/app/(dashboard)/client-greeting"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"


export const HomeView = () => {
  const router = useRouter()
  const {
    data: session
  } = authClient.useSession()
  if (!session) {
    return (
      <p>
        Loading...
      </p>
    )
  }
  return (
    <div className="p-4">
      <ClientGreeting />
    </div>
  )
}

