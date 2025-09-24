import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export const experimental_ppr = true;

export default async function Home({
  // What is searchParams? ==> It is the part of the URL after the question mark
  // Here is an example => https://yoursite.com/?query=React → searchParams = { query: "React" }
  //   // The object searchParams looks like this:
  /* 
  {
    query: "React",
    sort: "newest"
   }
  */
  // Thats why you do searchParams.query -> because searchParams is an object that contains the property query, which has the value of the search input
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  // We need () around await searchParams to await the Promise object first and THEN gets the query
  // The searchParams logic can only e
  const query = (await searchParams).query;

  // We need to take the inputted query and use to refilter the fetch results
  const params = { search: query || null };

  // From this session, we can get the Sanity ID of the author of that user
  // So we use this line, everytime we do anything AUTHOR-SPECIFIC (creating startups, we need to know who author of that startup is // showing user specific pages, we need to know who the user is)
  const session = await auth();
  console.log(session?.id);

  // It's a good idea to start with mock data, then build the UI component, setup database, and then replace mock data with real data fetching

  // const posts = await client.fetch(STARTUPS_QUERY);
  // Replace old fetch with this sanityFetch, so this it is revalidated whenever there's a new change

  // sanityFetch expects an object with query and params individually defined. but here, because we never renamed params to anything, we have params: params, which can be shortened to just params
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  return (
    <>
      <section className="pink_container pattern">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect With Entrpreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>
        {/* ! before class overrides other styles previously provided to element */}
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard, index: number) => (
              // Note that within a UL, we are mapping through the posts array and creating a StartupCard component for each item in posts. So, each StartupCard should be an li
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}

// Clear Data flow pattern you should note:
/* 
page.tsx → reads URL → passes to components
SearchForm.tsx → receives props → displays data

*/
