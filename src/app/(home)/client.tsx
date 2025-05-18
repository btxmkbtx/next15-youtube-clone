"use client";

import { trpc } from "@/trpc/client";

export const PageClient = () => {
  // trpc 客户端从缓存中提取数据,前提是数据再服务器组件类型的父页面组件中已经完成缓存
  const [data] = trpc.hello.useSuspenseQuery({
    text: "T Zachary",
  });

  return <div>Page client:{data.greeting}</div>;
};
