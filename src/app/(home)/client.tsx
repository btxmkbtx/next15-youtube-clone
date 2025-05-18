"use client";

import { trpc } from "@/trpc/client";

export const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "T Zachary",
  });

  return <div>Page client:{data.greeting}</div>;
};
