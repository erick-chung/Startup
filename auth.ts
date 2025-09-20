import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
});


// NextAuth() returns an object that includes handlers and the auth,signIn, and signOut functions

// We will use destructuring to pull those functions out of the NextAuth object and make them individual variables