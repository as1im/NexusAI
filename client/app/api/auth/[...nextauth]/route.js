import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const data = await res.json();

          if (res.ok && data.success) {
            // Return user object along with the custom backend token
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              token: data.token
            };
          }
          
          throw new Error(data.message || 'Invalid email or password');
        } catch (error) {
          console.error('[NextAuth Credentials Auth Error]:', error.message);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'github') {
        try {
          // Send GitHub details to Express backend to sync with MongoDB
          const res = await fetch('http://localhost:5000/api/auth/github', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              githubId: account.providerAccountId,
              avatarUrl: user.image
            })
          });

          const data = await res.json();

          if (res.ok && data.success) {
            // Append backend JWT and user ID to use in the jwt callback
            user.token = data.token;
            user.id = data.user.id;
            return true;
          }
          console.error('[GitHub Backend Sync Failed]:', data.message);
          return false;
        } catch (error) {
          console.error('[GitHub Backend Sync Error]:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET || 'nexusai-session-development-secret-987654'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
