import Form from "next/form";
import SearchFormReset from "./SearchFormReset";
import { Search } from "lucide-react"; // Lucide is a dependency of Shadcn

// Examples of server components: texts, images, html forms, links, static content
const SearchForm = ({ query }: { query?: string }) => {
  // Having the query in the URL is important so that it can be shareable, bookmarked, and copy and pasted to show specific results
  // Also adds browser forward/back navigation

  return (
    <Form action="/" scroll={false} className="search-form">
      <input
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search Startups"
      />

      <div className="flex gap-2">
        {query && <SearchFormReset />}
        <button type="submit" className="search-btn text-white">
          <Search className="size-5" />
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;
