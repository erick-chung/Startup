import { after } from "next/server";
import { client } from "@/sanity/lib/client";
import Ping from "./Ping";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false }) // This line is very important because with useCdn set as true, it might show old view counts from stale data. but with useCdn set as false, it will always show real time view count (tells Sanity to not use cached data. only give me the latest data)
    .fetch(STARTUP_VIEWS_QUERY, { id }); // { id } replaces the $id in query

  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit()
  );

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
};

export default View;
