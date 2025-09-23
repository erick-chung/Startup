// IMPORT EXTERNAL LIBRARIES FIRST
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation"; // A Next.js function that shows a 404 error page when something doesn't exist
import markdownit from "markdown-it";

// IMPORT INTERNAL/LOCAL LIBRARIES AFTER (indicated by @/)
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client"; // Just to remind you, client is the connection between your app and sanity. It lets you contact sanity and ask for data
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries"; // Just to let you know, @/ means start from the root of the projectws
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";

// We specifically keep this outside the component so it is not recreated everytime a new user visits the site. it's expensive to create
const md = markdownit(); // Calls the function markdownit() to create a markdown converter tool. Then, stores it in a variable called md

// Enables Partial Pre-Rendering
export const experimental_ppr = true;

// The reason why we made this Page component async, is because we need it to wait for database calls (Sanity)
const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  // Extract the startup ID from the url
  const id = (await params).id;

  // Go to sanity and get the startup with this specific ID
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id }); // Pass in the id-specific startup query along with the id for the page we're on

  // If no startup exists with that ID, return 404 error page
  if (!post) return notFound();

  // Return parsed markdown content so we can properly display it as HTML
  const parsedContent = md.render(post.pitch || "");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <Image // Original code uses <img /> but it's inconsistent and I would rather just use <Image /> for everything
          src={post.image}
          alt="thumbnail"
          width={800}
          height={600}
          className="w-full h-auto rounded-xl"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author.name}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            /> // This line is important, it takes the html string and renders it as actual html elements (not just text). It's important because without this line, youll see just raw html tags as text. but with it, you see properly formatted headings, bold text, etc
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />

        {/* TODO: EDITOR SELECTED STARTUPS */}

        <Suspense fallback={<Skeleton className="view-skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;

// Quick lesson on Promises
/* 
A promise is an object.
It has two properties: STATE & VALUE
The state propery
- Has the following values: PENDING, FULFILLED, OR REJECTED 
- So promises have a state property that gives info on the status of that promise, whether it's still waiting, whether it's completed, or whether it failed.
The value property
- Has the following values: THE RESULT (WHEN FULFILLED) OR AN ERROR (WHEN REJECTED)
- So promises have a value property that either successfully returns the data you requested or gives an error explaining what went wrong
*/

// What exactly is markdown? It's a way of writing and formatting text for people that aren't programmers/tech-savvy so that they can format stuff without knowing HTML. like for example, they dont need to do header tags, p tags, or a tags. they can indicate all that through markdown language. so its easier for them to input stuff on their end and we can simply jut convert it into html from our end.
