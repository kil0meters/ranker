import { ReactNode } from "react";
declare global {
    namespace JSX {
        type ElementType =
            | keyof JSX.IntrinsicElements
            | ((props: any) => Promise<ReactNode> | ReactNode);
    }
}

declare module 'next-auth' {
    interface Session {
        user?: DefaultUser & {
            id: string;
        };
    }
}

declare module 'next-auth/jwt/types' {
    interface JWT {
        uid: string;
    }
}
