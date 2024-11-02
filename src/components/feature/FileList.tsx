import { useUppyState } from "@/app/dashboard/useUppyStatus";
import { cn } from "@/lib/utils";
import { trpcClientReact, trpcPureClient } from "@/utils/api";
import Uppy, { UploadCallback, UploadSuccessCallback } from "@uppy/core";
import Image from "next/image";
import { useEffect, useState } from "react";

export function FileList({ uppy }: { uppy: Uppy }) {
  const { data: fileList, isPending } =
    trpcClientReact.file.listFiles.useQuery();

  const utils = trpcClientReact.useUtils();

  const [uploadingFileIDs, setUploadingFileIDs] = useState<string[]>([]);
  const uppyFiles = useUppyState(uppy, (s) => s.files);

  useEffect(() => {
    // アップロード成功時のコールバック関数
    const handle: UploadSuccessCallback<{}> = (file, resp) => {
      console.log(file);
      if (file) {
        // `trpcPureClient`を使用してアップロードされたファイルをサーバーに保存
        trpcPureClient.file.saveFile
          .mutate({
            name: file.data instanceof File ? file.data.name : "test",
            path: resp.uploadURL ?? "",
            type: file.data.type,
          })
          .then((resp) => {
            utils.file.listFiles.setData(void 0, (prev) => {
              if (!prev) {
                return prev;
              }
              return [resp, ...prev];
            });
          });
      }
    };

    const uploadProgressHandler: UploadCallback = (data) => {
      setUploadingFileIDs((currentFiles) => [...currentFiles, ...data.fileIDs]);
    };

    const completeHandler = () => {
      setUploadingFileIDs([]);
    };

    uppy.on("upload", uploadProgressHandler);
    // `upload-success`イベントが発生したときに、`handle`関数を呼び出すように登録
    uppy.on("upload-success", handle);

    uppy.on("complete", completeHandler);

    return () => {
      // コンポーネントのアンマウントや`uppy`の変更時に、`upload-success`のイベントハンドラーを削除
      uppy.off("upload-success", handle);
      uppy.off("upload", uploadProgressHandler);
      uppy.off("complete", completeHandler);
    };
  }, [uppy, utils]);
  return (
    <>
      {isPending && <div>loding...</div>}
      <div className={cn("flex flex-wrap gap-4 relative")}>
        {uploadingFileIDs.length > 0 &&
          uploadingFileIDs.map((id) => {
            const file = uppyFiles[id];
            const isImage = file.data.type.startsWith("image");
            const url = URL.createObjectURL(file.data);
            return (
              <div
                key={file.id}
                className="w-56 h-56 flex justify-center items-center border border-red-500"
              >
                {isImage ? (
                  <img src={url} alt={file.name} />
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
    </>
  );
}
