"use client";

import { Uppy } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import { useState } from "react";
import { useUppyState } from "./useUppyStatus";

export default function Dashboard() {
  const [uppy] = useState(() => {
    const uppy = new Uppy();
    uppy.use(AWSS3, {
      shouldUseMultipart: false,
      getUploadParameters() {
        return {
          url: "", //pre signed url
        };
      },
    });
    return uppy;
  });

  const files = useUppyState(uppy, (s) => Object.values(s.files));

  return (
    <div className="h-screen flex justify-center items-center">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              uppy.addFile({
                name: file.name,
                data: file,
              });
            });
          }
        }}
        multiple
      ></input>
      {files.map((file) => {
        const url = URL.createObjectURL(file.data);
        return <img src={url} key={file.id}></img>;
      })}
    </div>
  );
}
