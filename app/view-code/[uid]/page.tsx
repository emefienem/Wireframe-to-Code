"use client";

import AppHeader from "@/app/_components/AppHeader";
import Constants from "@/data/Constants";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import SelectionDetail from "../_components/SelectionDetail";
import CodeEditor from "../_components/CodeEditor";

export interface RECORD {
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
  const [codeResp, setCodeResp] = useState("");
  const [record, setRecord] = useState<RECORD | null>(null);
  useEffect(() => {
    uid && GetRecordInfo();
  }, [uid]);

  const GetRecordInfo = async () => {
    setLoading(true);
    const result = await axios.get("/api/wireframe-to-code?uid=" + uid);
    console.log(result.data);
    const resp = result?.data;
    setRecord(result?.data);
    // if (resp?.code === null) GenerateCode(resp);
    if (resp?.error) console.log("No Record Found");

    setLoading(false);
  };

  const GenerateCode = async (record: RECORD) => {
    setLoading(true);
    const response = await fetch("/api/ai-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: record?.description + ":" + Constants.PROMPT_OLD,
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

      const text = decoder
        .decode(value)
        .replace("```js", "")
        .replace("```javascript", "")
        .replace("```", "");
      setCodeResp((prev) => prev + text);
      console.log(text);
    }
    setLoading(false);
  };

  return (
    <div>
      <AppHeader hideSideBar={true} />
      <div className="grid grid-cols-1 md:grid-cols-5 p-5">
        <div>{record && <SelectionDetail record={record} />}</div>
        <div className="col-span-4">
          <CodeEditor />
        </div>
      </div>
      {/* ViewCode{loading && <LoaderCircle className="animate-spin" />}
      <p>{codeResp}</p> */}
    </div>
  );
}

export default ViewCode;
