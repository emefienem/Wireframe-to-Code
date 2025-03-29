import React from "react";
import { RECORD } from "../[uid]/page";
import Image from "next/image";

const SelectionDetail = ({ record }: { record: RECORD }) => {
  return (
    <div>
      <Image
        src={record?.imageUrl}
        alt="Wireframe"
        width={300}
        height={400}
        className="rounded-lg"
      />
    </div>
  );
};

export default SelectionDetail;
