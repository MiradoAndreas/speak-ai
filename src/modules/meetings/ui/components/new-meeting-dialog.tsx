import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useRouter } from "next/navigation";
import { MeetingsForm } from "./meeting-form";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
  open,
  onOpenChange
}: NewMeetingDialogProps) => {
  const router = useRouter()
  return (
    <ResponsiveDialog title="New Meeting" description="Create a new meeting" open={open} onOpenChange={onOpenChange}>
      <MeetingsForm onSuccess={(id) => {
        onOpenChange(false)
        router.push(`/meetings/${id}`)
      }}
        onCancel={() => onOpenChange} />
    </ResponsiveDialog>
  )
}
