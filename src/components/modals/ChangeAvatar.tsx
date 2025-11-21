import React from "react";
import { Camera, Upload, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

import { useIsMobile } from "@/hooks/use-mobile";

export const ChangePhotoModal = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const isMobile = useIsMobile();

  const [preview, setPreview] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);

  const handleFile = (e: any) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const InnerUI = (
    <>
      <div className="flex flex-col items-center mt-4 gap-6">

        {preview ? (
          <img
            src={preview}
            className="
              w-36 h-36 rounded-full object-cover
              shadow-xl ring-4 ring-primary/10
              transition-all duration-300
            "
          />
        ) : (
          <div
            className="
              w-36 h-36 rounded-full bg-gray-200
              flex flex-col items-center justify-center
              text-gray-500 gap-2 shadow-inner
            "
          >
            <ImagePlus className="h-6 w-6" />
          </div>
        )}

        <label
          htmlFor="photo-input"
          className="
            cursor-pointer px-4 py-2 rounded-lg
            bg-secondary text-secondary-foreground
            hover:bg-secondary/80 transition
            flex items-center gap-2 text-sm shadow-sm
          "
        >
          <Upload className="w-4 h-4" />
          Choose Photo
        </label>

        <input
          id="photo-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            size="icon"
            className="
              absolute bottom-1 right-1 h-8 w-8 rounded-full
              bg-primary shadow-lg text-white hover:scale-105 transition
            "
          >
            <Camera className="w-4 h-4" />
          </Button>
        </DrawerTrigger>

        <DrawerContent className="rounded-t-3xl pb-6">
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold">
              Update Profile Photo
            </DrawerTitle>
          </DrawerHeader>

          {InnerUI}

          <DrawerFooter>
            <div className="flex justify-between pt-4">
              <DrawerClose asChild>
                <Button variant="outline" className="w-1/2 mr-2">Cancel</Button>
              </DrawerClose>

              <Button
                className="w-1/2 ml-2"
                onClick={() => onUpload(file!)}
                disabled={!file}
              >
                Upload Photo
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="
            absolute bottom-1 right-1 h-8 w-8 rounded-full
            bg-primary shadow-lg hover:scale-105 transition
          "
        >
          <Camera className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md w-[calc(100%-2rem)] 
          sm:w-full rounded-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Update Profile Photo
          </DialogTitle>
        </DialogHeader>

        {InnerUI}

        <DialogFooter className="mt-6 gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button onClick={() => onUpload(file!)} disabled={!file}>
              Upload Photo
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
