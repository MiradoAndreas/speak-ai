import { ResponsiveDialog } from "@/components/responsive-dialog";

import { MeetingsForm } from "./meeting-form";
import { MeetingGetOne } from "../../types";

interface UpdateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetOne;
}

export const UpdateMeetingDialog = ({
  open,
  onOpenChange,
  initialValues
}: UpdateMeetingDialogProps) => {

  return (
    <ResponsiveDialog title="Edit Meeting" description="Create a edit meeting" open={open} onOpenChange={onOpenChange}>
      <MeetingsForm onSuccess={() => {
        onOpenChange(false)

      }}
        onCancel={() => onOpenChange(false)}

        initialValues={initialValues} />
    </ResponsiveDialog>
  )
}
