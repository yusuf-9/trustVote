import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    };
  }

  interface JWT {
    id: string;
  }
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
