import { SignIn } from "@clerk/nextjs/app-beta";
export const runtime = "experimental-edge";

export default function SigninPage() {
    return (
        <div className="flex justify-center items-center">
            <SignIn path="/" signUpUrl="/signup" />
        </div>
    );
}
