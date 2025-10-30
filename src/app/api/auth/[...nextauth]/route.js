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

          // Check if account is active
          if (user.status !== 'active') {
            console.log('❌ Account suspended');
            return null;
          }

          // Verify password using model method
          const isValid = await user.comparePassword(credentials.password);
          
          if (!isValid) {
            console.log('❌ Invalid password');
            return null;
          }

          // Update last login
          user.lastLogin = new Date();
          await user.save();

          console.log('✅ Authentication successful');

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'customer',
            phone: user.phone || '',
            company: user.company || '',
            address: user.profile?.deliveryAddress || '',
            image: user.image || null,
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
      // Initial sign in - add all user data to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
        token.company = user.company;
        token.address = user.address;
        token.image = user.image;
      }
      
      // Handle session updates from client (updateSession)
      if (trigger === 'update' && session?.user) {
        // Update token with new session data
        token.name = session.user.name || token.name;
        token.email = session.user.email || token.email;
        token.phone = session.user.phone || token.phone;
        token.company = session.user.company || token.company;
        token.address = session.user.address || token.address;
        token.image = session.user.image !== undefined ? session.user.image : token.image;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Add token data to session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.phone = token.phone;
        session.user.company = token.company;
        session.user.address = token.address;
        session.user.image = token.image;
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