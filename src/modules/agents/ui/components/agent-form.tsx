import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { agentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { GeneratedAvatar } from "@/components/generate-avatar";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues
}: AgentFormProps) => {
  const trpc = useTRPC()

  const queryClient = useQueryClient()

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Agent created successfullys")
        onSuccess?.()
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
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

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? ""
    }
  })

  const isEdit = !!initialValues?.id
  const isPending = createAgent.isPending

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      console.log("TODO: updateAgent")
    } else {
      createAgent.mutate(values)
    }
  }

  return (
    <form id="form-agent" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <GeneratedAvatar seed={form.watch("name")} variant="botttsNeutral" className="border size-16" />
      <FieldGroup>
        <Controller name="name" control={form.control} render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-agent-name">
              Name
            </FieldLabel>
            <Input {...field} id="form-agent-name" aria-invalid={fieldState.invalid} placeholder="e.g. Math Tutor" autoComplete="off" />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )} />

        <Controller name="instructions" control={form.control} render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-agent-instructions">
              Instructions
            </FieldLabel>
            <Textarea {...field} id="form-agent-instructions" aria-invalid={fieldState.invalid} placeholder="You are a helpful math assistant that can answer questions and help with assignments." />
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
  )
}