// 官方代码拷贝元：// 官方代码拷贝元：https://docs.uploadthing.com/getting-started/appdir#creating-your-first-file-route

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
