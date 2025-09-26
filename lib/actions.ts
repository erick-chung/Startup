"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import { parse } from "path";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  // CHANGE TO METHOD 2 LATER: CHECK GOOGLE DOCS
  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );
  //TODO: CHANGE LATER TO CONST SLUG = TITLE ? SLUGIFY(TITLE, {OPTIONS})
  const slug = slugify(title as string, { lower: true, strict: true }); // Options object, contains lower -> all lowercase, and strict -> removes special characters(limits to letters,numbers,and hyphens)

  try {
    const startup = {
      title, //same as title: title
      description,
      category,
      image: link, //rename link to image
      slug: {
        _type: slug, // tells Sanity that this is a slug field type
        current: slug, // current value is the variable slug from above
      },
      author: {
        _type: "reference", // here, instead of adding the author data directly, we simply add it as a reference. this is best practice as it avoids duplicating data. rule of thumb is that when the data exists as its own thing elsewhere its good to just refer to it instead of adding it again.
        _ref: session?.id, // this says what it is referring to. so the author id is the session.id
        // we dont need ._id for session because session comes from AUTH SYSTEM
      },
      pitch,
    };

    const result = await writeClient.create({ _type: "startup", ...startup });
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (err) {
    console.log(err);
    return parseServerActionResponse({
      // we're using this helper function because errors are returned by objects. error objects DONT SERIALIZE PROPERLY, so by using the helper function, we are returning a clean, serializable object that can safely be sent from server to client without any errors
      error: JSON.stringify(err), // err is an object so convert it into string format (YOU CANNOT STRINGIFY WITHOUT USING HELPER FUNCTION FIRST OR ELSE IT WILL JUST RETURN AN EMPTY OBJECT)
      status: "ERROR",
    });
  }
};
