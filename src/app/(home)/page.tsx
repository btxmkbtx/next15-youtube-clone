import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";

/*
 因为Next.js 默认会尽可能静态化服务端组件（SSG/ISR），而这个页面初期化时又有一个DB请求的事件，
 所以SSG/ISR）会造成prefetch在编译阶段报错。
  dynamic = "force-dynamic" 会强制该组件每次请求都动态渲染，类似传统 SSR。
 */
export const dynamic = "force-dynamic";

/*
在 Next.js 的 RSC (React Server Components) 架构中，将 searchParams 定义为 Promise 类型的主要好处是 支持流式渲染（Streaming）和渐进式数据加载。
这种设计模式特别适用于需要优化首屏性能或处理动态参数的场景。
*/
interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { categoryId } = await searchParams;

  // trpc 服务端取出数据放入缓存
  void trpc.categories.getMany.prefetch();

  // 通过服务端的HydrateClient将数据注入到客户端
  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}
