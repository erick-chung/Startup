"use client";
import { X } from "lucide-react";
// This component will not work if JavaScript is disabled; therefore, it must be a client component
// Default to server components whenever possible but if you need Javascript for it to function then you must add "use client"
// Examples of client components: click handlers, state management, browser APIs(document, window, localStorage), and interactive features like dropdowns and modals

import Link from "next/link";

const SearchFormReset = () => {
  const reset = () => {
    // Using document.querySelector is a lot more simple than creating state (always go with the simplest option when possible)
    const form = document.querySelector(".search-form") as HTMLFormElement;

    if (form) form.reset();
  };
  return (
    <button type="reset" onClick={reset}>
      <Link href="/" className="search-btn text-white">
        <X className="size-5" />
      </Link>
    </button>
  );
};

export default SearchFormReset;
