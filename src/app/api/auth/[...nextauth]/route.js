// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/lib/db/models/User';
import connectDB from '@/lib/db/mongodb';

// Define auth options
const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
          placeholder: 'demo@estonkd.com' 
        },
        password: { 
          label: 'Password', 
          type: 'password',
          placeholder: '******' 
        }
      },
      async authorize(credentials, req) {
        console.log('🔐 Authorize attempt:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        try {
          // Connect to MongoDB
          await connectDB();

          // Find and authenticate user using MongoDB model
          const user = await User.findByEmail(credentials.email);
          
          if (!user) {
            console.log('❌ User not found');
            return null;
          }

          // Verify password using model method
          const isValid = await user.comparePassword(credentials.password);
          
          if (!isValid) {
            console.log('❌ Invalid password');
            return null;
          }

          console.log('✅ Authentication successful');

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'customer',
          };
        } catch (error) {
          console.error('❌ Auth error:', error);
          return null;
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      
      // Handle session updates
      if (trigger === 'update' && session) {
        return { ...token, ...session.user };
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
  
  debug: process.env.NODE_ENV === 'development',
};

// Create handler
const handler = NextAuth(authOptions);

// Export for Next.js App Router
export { handler as GET, handler as POST };
export { authOptions };