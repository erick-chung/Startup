import { type SchemaTypeDefinition } from "sanity";
import { author } from "./author";
import { startup } from "./startup";

export const schema: { types: SchemaTypeDefinition[] } = {
  // By adding author to types, you're "registering" your author schema with Sanity
  types: [author, startup],
};
