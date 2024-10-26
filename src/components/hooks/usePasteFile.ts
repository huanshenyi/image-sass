import { useEffect } from "react";

/**
 * usePasteFile カスタムフック
 *
 * このフックは、ユーザーがクリップボードからファイルを貼り付けたときに
 * `onFilesPaste`コールバックを呼び出します。貼り付けられたファイルは`onFilesPaste`の引数として渡されます。
 *
 * @param {Function} onFilesPaste - ファイルが貼り付けられた際に呼び出されるコールバック関数。貼り付けられた
 * ファイルの配列（File[]）が渡されます。
 */
export function usePasteFile({
  onFilesPaste,
}: {
  onFilesPaste: (files: File[]) => void;
}) {
  useEffect(() => {
    // クリップボードからの貼り付けイベントをハンドリングする関数
    const pasteHandle = (e: ClipboardEvent) => {
      const files: File[] = [];
      if (!e.clipboardData) {
        return;
      }
      // クリップボード内の項目を調べ、ファイルがあれば追加
      Array.from(e.clipboardData?.items).forEach((item) => {
        const f = item.getAsFile();
        if (f) {
          files.push(f);
        }
      });
      // ファイルが存在する場合、コールバックを実行
      if (files.length > 0) {
        onFilesPaste(files);
      }
    };

    // ペーストイベントのリスナーを追加
    document.body.addEventListener("paste", pasteHandle);

    return () => {
      document.body.removeEventListener("paste", pasteHandle);
    };
  }, [onFilesPaste]);
}
