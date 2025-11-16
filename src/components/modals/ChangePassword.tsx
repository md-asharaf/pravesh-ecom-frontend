import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

export const ChangePasswordModal = ({ onChangePassword }: any) => {
  const [oldPass, setOld] = React.useState("");
  const [newPass, setNew] = React.useState("");
  const [confirmPass, setConfirm] = React.useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full rounded-xl">
          Change Password
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <p className="text-sm mb-1">Current Password</p>
            <Input type="password" value={oldPass} onChange={(e) => setOld(e.target.value)} />
          </div>

          <div>
            <p className="text-sm mb-1">New Password</p>
            <Input type="password" value={newPass} onChange={(e) => setNew(e.target.value)} />
          </div>

          <div>
            <p className="text-sm mb-1">Confirm Password</p>
            <Input type="password" value={confirmPass} onChange={(e) => setConfirm(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => onChangePassword({ oldPass, newPass, confirmPass })}>
            Update Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
