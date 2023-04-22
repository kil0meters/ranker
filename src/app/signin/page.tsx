import { SigninButton } from './signin-button';

export default function SigninPage() {
	return (
        <main className="container mx-auto min-h-screen flex items-center justify-center align-baseline">
            <div className="h-full align-middle">
                <div className="flex flex-col gap-4 border-neutral-300 rounded border max-w-lg p-8 mb-28">
                    <h1 className="text-lg">Sign in</h1>
                    <SigninButton provider="github" providerStyle="GitHub" />
                </div>
            </div>
        </main>
	)
}
