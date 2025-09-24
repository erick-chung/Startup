import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";
import { client } from "./sanity/lib/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({
      // Purpose: Check if the GitHub user exists in Sanity database. If not, create their profile, add to sanity database, and let them sign in.
      // Only runs when user attemps to log in
      user: { name, email, image },
      profile: { id, login, bio },
    }) {
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id,
        });
      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || "",
        });
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      // Purpose: Create a token (digital ID card) that is unique to every author/user. Used to identify when needed
      // Also only runs when user logs in or when token expires
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });
        token.id = user?._id;
      }
      return token;
    },
    async session({ session, token }) {
      // Purpose: Reads the token/digital ID card when needed for any author-specific actions such as creating a startup, or looking at user-specific details
      // Only runs when called by const session = await auth();
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});

// NextAuth() returns an object that includes handlers and the auth,signIn, and signOut functions

// We will use destructuring to pull those functions out of the NextAuth object and make them individual variables
