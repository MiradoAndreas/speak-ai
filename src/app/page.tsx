"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'
import { toast } from 'sonner'

const Page = () => {

  const { data: session } = authClient.useSession()


  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = () => {
    authClient.signUp.email({
      email,
      name,
      password
    }, {
      onError: () => {
        toast.error("Someting went wrong")
      },
      onSuccess: () => {
        toast.success(`Bienvenu ${name}`)
      }
    })
  }

  if (session) {
    return (
      <div className='flex flex-col p-4 gap-y-4'>
        <p>Logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-y-4 min-w-xl md:min-w-2xl mx-auto my-2'>
      <Input placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onSubmit}>
        Create User
      </Button>
    </div>
  )
}

export default Page