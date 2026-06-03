import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'dev@nexusai.local' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Simple mock authentication stub for developer workspace testing
        if (credentials.email === 'dev@nexusai.local' && credentials.password === 'password') {
          return { id: 'mock-user-id', name: 'Dev User', email: 'dev@nexusai.local' };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/' // Fallback landing page for mock login
  },
  secret: process.env.NEXTAUTH_SECRET || 'nexusai-session-development-secret-987654'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
