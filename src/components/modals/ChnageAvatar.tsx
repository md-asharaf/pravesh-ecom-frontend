import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { Camera } from "lucide-react";

export const ChangePhotoModal = ({ onUpload }: any) => {
  const [preview, setPreview] = React.useState<any>(null);
  const [file, setFile] = React.useState<any>(null);

  const handleFile = (e: any) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary shadow text-white"
        >
          <Camera className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Profile Photo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center mt-4 space-y-4">
          {preview ? (
            <img src={preview} className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/20" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}

          <input type="file" accept="image/*" onChange={handleFile} />
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => onUpload(file)} disabled={!file}>
            Upload Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
