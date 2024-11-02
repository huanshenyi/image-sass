"use client";

import Uppy from "@uppy/core";
import { ReactNode, useState, useRef, HTMLAttributes } from "react";

/**
 * Dropzoneコンポーネント
 *
 * ドラッグ＆ドロップによるファイルのアップロードエリアを提供し、ファイルがドロップされると
 * Uppyインスタンスにファイルが追加されます。ユーザーがドラッグ中かどうかの状態も提供し、
 * 子要素としてエリア内の表示を動的に変更することが可能です。
 *
 * @param {Uppy} uppy - Uppyのインスタンス。ファイルのアップロード管理に使用します。
 * @param {ReactNode | function} children - ドロップエリア内に表示する要素。関数の場合は`dragging`状態を引数にとり、
 * ドラッグ中かどうかで表示内容を変更できます。
 */
export function Dropzone({
  uppy,
  children,
  ...divProps
}: {
  uppy: Uppy;
  children: ReactNode | ((draging: boolean) => ReactNode);
} & Omit<HTMLAttributes<HTMLDivElement>, "children">) {
  const [darging, setDarging] = useState(false); // ドラッグ中の状態
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // ドラッグ状態の解除用タイマー

  return (
    <div
      // 先に配置する必要がある,でなければ失効する
      {...divProps}
      // ドラッグエリアにファイルが入った時の処理
      onDragEnter={(e) => {
        e.preventDefault();
        setDarging(true);
      }}
      // ドラッグがエリア外に出た際の処理（ディレイをかけて状態をリセット）
      onDragLeave={(e) => {
        e.preventDefault();
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        timerRef.current = setTimeout(() => {
          setDarging(false);
        }, 50); // 一瞬の誤検知を防ぐためのディレイ
      }}
      // ドラッグ中のデフォルト挙動を防止し、タイマーのリセット
      onDragOver={(e) => {
        e.preventDefault();
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }}
      // ファイルがドロップされた時の処理
      onDrop={(e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;

        // Uppyインスタンスにファイルを追加
        Array.from(files).forEach((file) => {
          uppy.addFile({
            data: file,
          });
        });
        setDarging(false); // ドラッグ中の状態をリセット
      }}
    >
      {/* 子要素が関数の場合、ドラッグ中の状態を渡す */}
      {typeof children === "function" ? children(darging) : children}
    </div>
  );
}
