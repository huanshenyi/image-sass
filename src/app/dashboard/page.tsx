import { createContext, serverCaller } from "@/utils/trpc";

export default async function Dashboard() {
  const context = await createContext();
  const data = await serverCaller(context).hello();
  return (
    <div className="h-screen flex justify-center items-center">
      Dashboard {data.hello}
    </div>
  );
}
