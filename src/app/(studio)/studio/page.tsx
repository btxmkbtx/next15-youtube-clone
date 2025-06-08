import { DEFAULT_LIMIT } from "@/constants";
import { StudioView } from "@/modules/studio/ui/view/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";

const Page = async () => {
  //注意1：prefetchInfinite对应的query方法是useSuspenseInfiniteQuery
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT, //注意2：prefetchInfinite的limit要与useSuspenseInfiniteQuery的limit对等
  });

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default Page;
