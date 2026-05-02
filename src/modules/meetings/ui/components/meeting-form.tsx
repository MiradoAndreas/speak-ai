import { useTRPC } from "@/trpc/client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { MeetingGetOne } from "../../types";
import { meetingsInsertSchema } from "../../schemas";
import { useState } from "react";
import { CommandSelect } from "./command-select";
import { GeneratedAvatar } from "@/components/generate-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingsFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingsForm = ({
  onSuccess,
  onCancel,
  initialValues
}: MeetingsFormProps) => {
  const trpc = useTRPC()

  const queryClient = useQueryClient()
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false)
  const [agentSearch, setAgentSearch] = useState("")

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch
    })
  )

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        toast.success("Agent created successfullys")
        onSuccess?.(data.id)
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        )

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({
              id: initialValues.id
            })
          )
        }


      },
      onError: (error) => {
        toast.error(error.message || "Someting went wrong")

        //TODO: Check if error is "FORBIDDEN" and redirect to sign in
      }
    })
  )

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Agent update successfullys")
        onSuccess?.()
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        )

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({
              id: initialValues.id
            })
          )
        }

        //TODO: Invalidate free tier usage


      },
      onError: (error) => {
        toast.error(error.message || "Someting went wrong")
        //TODO: Check if error is "FORBIDDEN" and redirect to sign in
      }
    })
  )

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? ""
    }
  })

  const isEdit = !!initialValues?.id
  const isPending = createMeeting.isPending || updateMeeting.isPending

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({
        ...values,
        id: initialValues.id
      })
    } else {
      createMeeting.mutate(values)
    }
  }

  return (
    <>
      <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
      <form id="form-agent" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

        <FieldGroup>
          <Controller name="name" control={form.control} render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-agent-name">
                Name
              </FieldLabel>
              <Input {...field} id="form-agent-name" aria-invalid={fieldState.invalid} placeholder="e.g Math Consolidations" autoComplete="off" />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )} />


        </FieldGroup>

        <FieldGroup>
          <Controller name="agentId" control={form.control} render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-agent-name">
                Agent
              </FieldLabel>
              <CommandSelect options={(agents.data?.items ?? []).map((agent) => ({
                id: agent.id,
                value: agent.id,
                children: (
                  <div className="flex items-center gap-x-2">
                    <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="border size-8" />
                    <span>{agent.name}</span>
                  </div>
                )
              }))}
                onSelect={field.onChange}
                onSearch={setAgentSearch}
                value={field.value}
                placeholder="Select an agent"
              />
              <FieldDescription>
                Not found what you are looking for? <button type="button" className="text-primary hover:underline" onClick={() => setOpenNewAgentDialog(true)}>Create a new agent</button>
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )} />


        </FieldGroup>

        <div className="flex justify-between gap-x-2">
          {onCancel && (
            <Button
              variant="ghost"
              disabled={isPending}
              type="button"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          )}
          <Button disabled={isPending} type="submit">
            {isPending && <Spinner className="mr-1" />}
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </>
  )
}