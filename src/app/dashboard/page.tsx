"use client";

import { Uppy } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import { useState } from "react";
import { trpcPureClient } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { UploadButton } from "@/components/feature/UploadButton";
import { Dropzone } from "@/components/feature/Dropzone";
import { usePasteFile } from "@/components/hooks/usePasteFile";
import { UploadPreview } from "@/components/feature/UploadPreview";
import { FileList } from "@/components/feature/FileList";

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

  // ファイルのコピーぺー対応する
  usePasteFile({
    onFilesPaste: (files) => {
      uppy.addFiles(
        files.map((file) => ({
          data: file,
        }))
      );
    },
  });

  // const uppyFiles = useUppyState(uppy, (s) => s.files);

  // fileの表示は署名付きurl使ったほうがいい、よりセキュアな方法
  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => {
            uppy.upload();
          }}
        >
          Upload
        </Button>
        <UploadButton uppy={uppy}></UploadButton>
      </div>

      <Dropzone uppy={uppy} className="relative">
        {(draging) => {
          return (
            <>
              {draging && (
                <div className="absolute inset-0 bg-secondary/50 z-10 flex justify-center items-center text-3xl">
                  Drop File Here to Upload
                </div>
              )}
              <FileList uppy={uppy}></FileList>
            </>
          );
        }}
      </Dropzone>
      <UploadPreview uppy={uppy}></UploadPreview>
    </div>
  );
}
