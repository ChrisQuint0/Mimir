"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateBootcampDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBootcampDialog({
  open,
  onOpenChange,
}: CreateBootcampDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Create Your Bootcamp
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Define your learning goal and let Mimir craft a personalized
            curriculum just for you.
          </DialogDescription>
        </DialogHeader>

        {/* Form will go here in Day 7 */}
        <div className="py-8 text-center text-slate-400">
          <p>Form coming in Day 7! 🚀</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
