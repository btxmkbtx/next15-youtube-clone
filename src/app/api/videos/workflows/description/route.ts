import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

/**
 * 这里拿到的参数名是workflow的触发器的请求体决定的
 * src\modules\videos\server\procedures.ts->generateDescription->workflow.trigger->body
 * */
interface InputType {
  userId: string;
  videoId: string;
}

const AI_PROMPT_GENERATE_DESCRIPTION = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

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

  // 让AI生成一个标题，chatGPT要钱（429错误），deepseek模型错误，所以这功能暂时不好用，这就是体验一下wrokflow流程
  const { body } = await context.api.openai.call(
    "Call OpenAI to generate description",
    {
      token: process.env.OPENAI_API_KEY!,
      operation: "chat.completions.create",
      body: {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: AI_PROMPT_GENERATE_DESCRIPTION,
          },
          {
            role: "user",
            content: transcript,
          },
        ],
      },
    }
  );

  const description = body.choices?.[0]?.message.content;
  if (!description) {
    throw new Error("Bad request");
  }

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ description: description || video.description })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
