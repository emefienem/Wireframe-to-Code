"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storage } from "@/configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from "axios";
import uuid4 from "uuid4";
import { useAuthContext } from "@/app/provider";

const ImageUpload = () => {
  const AIModel = [
    {
      name: "Google Gemini",
      icon: "/google.png",
    },
    {
      name: "LLama By Meta",
      icon: "/meta.png",
    },
    {
      name: "Deepseek",
      icon: "/deepseek.png",
    },
  ];
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<any>();
  const [model, setModel] = useState<string>();
  const [description, setDescription] = useState<string>();
  const { user } = useAuthContext();

  const onImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      // const imageUrl = URL.createObjectURL(files[0]);
      // setFile(files[0]);
      // setPreviewUrl(imageUrl);
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        if (reader.result) {
          localStorage.setItem("previewImage", reader.result as string);
          // console.log("Image saved...");
          setPreviewUrl(reader.result as string);
          setFile(files[0]);
        }
      };
    }
  };

  // const onConvertToCodeButtonClick = async () => {
  //   if (!file || !model || !description) {
  //     return;
  //   }
  //   const fileName = Date.now().toString() + ".png";
  //   const imageRef = ref(storage, "Wireframe_To_Code/" + fileName);
  //   await uploadBytes(imageRef, file).then((resp) => {
  //     console.log("Image uploaded...");
  //   });
  //   const imageUrl = await getDownloadURL(imageRef);
  //   console.log(imageUrl);
  // };

  const onConvertToCodeButtonClick = async () => {
    const storedImage = localStorage.getItem("previewImage");
    const storedModel = model;
    const storedDescription = description;

    if (!storedImage || !storedModel || !storedDescription) {
      console.error("Missing data. Please Select All Fields.");
      return;
    }

    localStorage.setItem("selectedModel", storedModel);
    localStorage.setItem("description", storedDescription);

    // console.log("Image Data URL:", storedImage);
    // console.log("Selected AI Model:", storedModel);
    // console.log("Description:", storedDescription);

    // // Simulating an action like sending this data to an API
    console.log("Uploaded Successfully!");
    const uid = uuid4();
    const result = await axios.post("/api/wireframe-to-code", {
      uid: uid,
      description: storedDescription,
      imageUrl: storedImage,
      model: storedModel,
      email: user?.email,
    });
    console.log(result.data);
  };

  useEffect(() => {
    const savedImage = localStorage.getItem("previewImage");
    if (savedImage) setPreviewUrl(savedImage);
  }, []);

  const clearPreview = () => {
    setPreviewUrl(null);
    setFile(undefined);
    localStorage.removeItem("previewImage");
  };

  const onModelChange = (value: string) => {
    setModel(value);
    localStorage.setItem("selectedModel", value);
  };

  const onDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
    localStorage.setItem("description", event.target.value);
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!previewUrl ? (
          <div className="p-7 border border-dashed rounded-md shadow-md flex flex-col items-center justify-center">
            <CloudUpload className="h-10 w-10 text-primary" />
            <h2 className="font-bold text-lg">Upload image</h2>
            <p className="text-gray-400 mt-3">
              Click Button to Select Wireframe Image
            </p>
            <div className="p-5 border border-dashed w-full flex justify-center mt-5">
              <label htmlFor="imageSelect">
                <h2 className="p-2 bg-green-100 font-medium text-primary rounded-md px-5 cursor-pointer">
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
              onClick={clearPreview}
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
        <div className="p-7 border shadow-md rounded-lg">
          <h2 className="font-semibold">Select AI Model</h2>
          <Select onValueChange={onModelChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              {AIModel.map((model, index) => (
                <SelectItem value={model.name} key={index}>
                  <div className="flex gap-2 items-center">
                    <Image
                      alt={model.name}
                      width={25}
                      height={25}
                      src={model.icon}
                    />
                    <h2>{model.name}</h2>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <h2 className="font-bold text-lg mt-7">
            Enter description about your webpage
          </h2>{" "}
          <Textarea
            onChange={onDescriptionChange}
            className="mt-3 h-[200px]"
            placeholder="Write about your webpage"
          />
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center">
        <Button onClick={onConvertToCodeButtonClick}>
          {" "}
          <WandSparkles /> Convert to Code
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
