import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

export const EditProfileModal = ({ user, onSave }: any) => {
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email || "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full rounded-xl">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <p className="text-sm mb-1">Full Name</p>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <p className="text-sm mb-1">Email</p>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => onSave({ name, email })}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
