import { SigninButton } from './signin-button';

export default function SigninPage() {
    return (
        <main className="container mx-auto">
            <div className='flex grid-cols-2 gap-4 border-neutral-300 rounded p-4 flex-col border'>
                <h1 className='text-lg'>Sign in</h1>
                <SigninButton provider='github' providerStyle="GitHub" />
            </div>
        </main>
    )
}
