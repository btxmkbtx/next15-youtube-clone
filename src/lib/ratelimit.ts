import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// 用于请求限流，防止恶意的频繁API请求攻击，疯狂刷新页面可会被判断为恶意攻击拦截请求
export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
});
