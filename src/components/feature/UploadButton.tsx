import Uppy from "@uppy/core";
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";
import { useRef } from "react";

/**
 * UploadButton コンポーネント
 *
 * このコンポーネントは、ファイルを選択・アップロードするためのボタンと隠れたファイル入力を提供します。
 * ボタンをクリックすると、ファイル入力を開き、ユーザーが選択したファイルをUppyインスタンスに追加します。
 *
 * @param {Uppy} uppy - Uppyインスタンス。ファイルの管理とアップロードに使用されます。
 */
export function UploadButton({ uppy }: { uppy: Uppy }) {
  // ファイル入力を参照するための参照オブジェクト
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      {/* アップロードボタン */}
      <Button
        variant={"ghost"}
        onClick={() => {
          if (inputRef.current) {
            // ファイル入力をクリックしてファイル選択を開始
            inputRef.current.click();
          }
        }}
      >
        <Plus />
      </Button>
      <input
        ref={inputRef}
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              // 選択された各ファイルをUppyインスタンスに追加
              uppy.addFile({
                data: file,
              });
            });
            e.target.value = "";
          }
        }}
        multiple // 複数ファイルの選択を許可
        className="fixed left-[-10000px]" // ファイル入力を画面外に配置
      ></input>
    </>
  );
}
