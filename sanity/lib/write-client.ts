import "server-only";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, token } from "../env";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  // useCdn set to true revalidates content every 60 seconds (ISR)
  // Set as false to get real-time updates instead of having to wait 60 seconds
  token,
});

if (!writeClient.config().token) {
  throw new Error("Write token not found.");
}
