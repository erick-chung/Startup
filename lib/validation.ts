import { z } from "zod";
export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  link: z
    .string()
    .url()
    .refine(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");
        return contentType?.startsWith("image/"); // This already returns either true or false so we dont need an if/else statement to return either true or false
      } catch {
        return false;
      }
    }, "Please provide a valid image URL!"),
  pitch: z.string().min(10),
});
