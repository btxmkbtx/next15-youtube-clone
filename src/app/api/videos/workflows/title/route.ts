import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

/**
 * 这里拿到的参数名是workflow的触发器的请求体决定的
 * src\modules\videos\server\procedures.ts->generateTitle->workflow.trigger->body
 * */
interface InputType {
  userId: string;
  videoId: string;
}

const AI_PROMPT_GENERATE_TITLE = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  const video = await context.run("get-video", async () => {
    // 解构Array[0]的语法糖写法,这个existingVideo就相当于结果data[0]
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Not found");
    }

    return existingVideo;
  });

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = await response.text();

    if (!text) {
      throw new Error("Bad request");
    }

    return text;
  });

  /* 
  让AI生成一个标题，chatGPT要钱（429错误），deepseek要钱（Insufficient Balance错误），
  所以这功能暂时不好用，这就是体验一下wrokflow流程
  */
  const { body } = await context.api.openai.call(
    "Call Deepseek to generate title",
    {
      baseURL: "https://api.deepseek.com",
      token: process.env.DEEPSEEK_API_KEY!,
      operation: "chat.completions.create",
      body: {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: AI_PROMPT_GENERATE_TITLE,
          },
          {
            role: "user",
            content: transcript,
          },
        ],
      },
    }
  );

  const title = body.choices?.[0]?.message.content;
  if (!title) {
    throw new Error("Bad request");
  }

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ title: title || video.title })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
