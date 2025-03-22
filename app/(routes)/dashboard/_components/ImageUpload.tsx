"use client";
import { Button } from "@/components/ui/button";
import { CloudUpload, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

const ImageUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const onImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log(files[0]);
      const imageUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(imageUrl);
    }
  };
  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!previewUrl ? (
          <div className="p-7 border border-dashed rounded-md shadow-md flex flex-col items-center justify-center">
            <CloudUpload />
            <h2 className="font-bold text-lg">Upload image</h2>
            <p className="text-gray-400 mt-3">
              Click Button to Select Wireframe Image
            </p>
            <div className="p-5 border border-dashed w-full flex justify-center mt-5">
              <label htmlFor="imageSelect">
                <h2 className="p-2 bg-primary text-white rounded-md px-5 cursor-pointer">
                  Select Image
                </h2>
              </label>
            </div>
            <input
              type="file"
              id="imageSelect"
              className="hidden"
              multiple={false}
              onChange={onImageSelect}
            />
          </div>
        ) : (
          <div className="p-5 border border-dashed ">
            <X
              className="flex justify-end w-full cursor-pointer"
              onClick={() => setPreviewUrl(null)}
            />
            <Image
              src={previewUrl}
              alt="preview"
              width={100}
              height={100}
              className="w-full h-[300px] object-contain"
            />
          </div>
        )}
        <div>User Text input</div>
      </div>
    </div>
  );
};

export default ImageUpload;
