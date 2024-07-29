"use client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { trpcClient, trpcClientReact } from "@/utils/api";
import { useEffect } from "react";

export default function Home() {
  const { data, isLoading } = trpcClientReact.hello.useQuery();

  return (
    <div className="h-screen flex justify-center items-center">
      <form className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Create App</h1>
        <Input type="text" placeholder="App Name" name="name" />
        <Textarea placeholder="description" name="Description" />
        <Button type="submit">Submit</Button>
        {data && <p>{data.hello}</p>}
        {isLoading && <p>Loading...</p>}
      </form>
    </div>
  );
}
