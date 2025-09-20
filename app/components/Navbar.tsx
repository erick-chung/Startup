import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";


// Note how we can turn the entire component into async cuz its a server side component
const Navbar = async () => {
  // How to know if user is logged in? Look into a user session that comes directly from Next Auth
  const session = await auth();
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {session?.user ? ( // If user is logged in, show these buttons (if session exists and if that session has a user)
          //If session exists, it means the user is logged in and auth systems guarantee that user exists. if not logged in, session is set to null
            <>
              <Link href="/startup/create">
                <span>Create</span>
              </Link>
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/"}); // Adding the reDirectTo makes it so that after you sign out, you are redirected to home page
              }}>
                <button type="submit">Logout</button>
              </form>

              <Link href={`/user/${session?.id}`}>
                <span>{session?.user?.name}</span>
              </Link>
            </>
          ) : (
            // Use a form with a server action to run server code. You cannot do this with buttons and onClick functions
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
