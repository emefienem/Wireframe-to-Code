"use client";

import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface RECORD {
  id: number;
  description: string;
  code: any;
  imageUrl: string;
  model: string;
  createdBy: string;
}
function ViewCode() {
  const { uid } = useParams();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    uid && GetRecordInfo();
  }, [uid]);

  const GetRecordInfo = async () => {
    setLoading(true);
    const result = await axios.get("/api/wireframe-to-code?uid=" + uid);
    console.log(result.data);
    const resp = result?.data;
    if (resp?.code === null) GenerateCode(resp);
    if (resp?.error) console.log("No Record Found");

    setLoading(false);
  };

  const GenerateCode = async (record: RECORD) => {
    setLoading(true);
    const response = await fetch("/api/ai-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: record?.description,
        model: record?.model,
        imageUrl: record?.imageUrl,
      }),
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      console.log(text);
    }
    setLoading(false);
  };

  return <div>{loading && <LoaderCircle className="animate-spin" />}</div>;
}

export default ViewCode;
