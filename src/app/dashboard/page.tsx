"use client";

import { UploadSuccessCallback, Uppy } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import { useEffect, useState } from "react";
import { useUppyState } from "./useUppyStatus";
import { trpcClientReact, trpcPureClient } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { UploadButton } from "@/components/feature/UploadButton";
import Image from "next/image";

export default function Dashboard() {
  const [uppy] = useState(() => {
    const uppy = new Uppy();
    uppy.use(AWSS3, {
      shouldUseMultipart: false,
      getUploadParameters(file) {
        return trpcPureClient.file.createPresignedUrl.mutate({
          filename: file.data instanceof File ? file.data.name : "test",
          contentType: file.data.type || "",
          size: file.size,
        });
      },
    });
    return uppy;
  });

  const files = useUppyState(uppy, (s) => Object.values(s.files));
  const progress = useUppyState(uppy, (s) => s.totalProgress);

  useEffect(() => {
    const handle: UploadSuccessCallback<{}> = (file, resp) => {
      if (file) {
        trpcPureClient.file.saveFile.mutate({
          name: file.data instanceof File ? file.data.name : "test",
          path: resp.uploadURL ?? "",
          type: file.data.type,
        });
      }
    };
    uppy.on("upload-success", handle);
    return () => {
      uppy.off("upload-success", handle);
    };
  }, [uppy]);

  const { data: fileList, isPending } =
    trpcClientReact.file.listFiles.useQuery();

  // fileの表示は署名付きurl使ったほうがいい、よりセキュアな方法
  return (
    <div className="container mx-auto">
      <div>
        <UploadButton uppy={uppy}></UploadButton>
        <Button
          onClick={() => {
            uppy.upload();
          }}
        >
          Upload
        </Button>
      </div>
      {isPending && <div>loding...</div>}
      <div className="flex flex-wrap gap-4">
        {fileList?.map((file) => {
          const isImage = file.contentType.startsWith("image");
          return (
            <div
              key={file.id}
              className="w-56 h-56 flex justify-center items-center border"
            >
              {isImage ? (
                <img src={file.url} alt={file.name} />
              ) : (
                <Image
                  alt=""
                  src="/unknown-file-types.png"
                  width={100}
                  height={100}
                />
              )}
            </div>
          );
        })}
      </div>

      {files.map((file) => {
        const url = URL.createObjectURL(file.data);
        return <img src={url} key={file.id}></img>;
      })}
      <div>{progress}</div>
    </div>
  );
}
