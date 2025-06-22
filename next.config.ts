import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      /**
       * 我们在procedures api和webhook中的处理中，已经把封面和预览动图上传到uploadThing里了，
       * 画面上的nextImage访问的图片都来自uploadThing了，就不用开放mux的域名了
       * src\modules\videos\server\procedures.ts
       * src\app\api\videos\webhook\route.ts
       */
      // {
      //   protocol: "https",
      //   hostname: "image.mux.com",
      // },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
