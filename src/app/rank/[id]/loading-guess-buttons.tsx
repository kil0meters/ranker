export function LoadingGuessButtons() {
    return (
        <div className="grid grid-cols-2 w-full gap-8 mb-4 aspect-[32/9]">
            <div className='shadow-lg aspect-video p-8 text-3xl font-extrabold rounded-md transition-all bg-neutral-700 text-neutral-50 hover:bg-neutral-600 hover:shadow-xl flex items-center justify-center'>
                <div className="h-8 w-48 animate-pulse bg-neutral-500 rounded-md" />
            </div>
            <div className='shadow-lg aspect-video p-8 text-3xl font-extrabold rounded-md transition-all bg-neutral-700 text-neutral-50 hover:bg-neutral-600 hover:shadow-xl flex items-center justify-center'>
                <div className="h-8 w-48 animate-pulse bg-neutral-500 rounded-md" />
            </div>
        </div>
    );
}
