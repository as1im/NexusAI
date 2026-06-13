import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create-resume/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/result/:path*",
  ]
};
