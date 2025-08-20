import Link from 'next/link'

export function Navbar() {
    return (
        <nav className="w-full mx-auto h-16 border-b border-border border-neutral-800 fixed top-0 left-0 right-0 backdrop-blur">
            <div className="flex items-center max-w-6xl mx-auto h-full px-8">
                <Link
                    href="/"
                    className="text-xl font-bold text-white"
                >
                    🐴 broncosearch
                </Link>
            </div>
        </nav>
    )
}