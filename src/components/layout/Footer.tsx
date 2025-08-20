import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'


export function Footer() {
    return (
        <footer className="border-t border-border border-neutral-800 py-4 w-full flex justify-center">
            <div className="flex items-center max-w-6xl mx-auto h-full px-8">
                <Link
                    href="https://github.com/contactkc/broncosearch"
                    className="text-sm text-neutral-400 font-bold text-accent flex items-center gap-2 hover:text-white transition-colors mx-auto"
                    target="_blank"
                >
                    <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
                    github
                </Link>
            </div>
        </footer>
    )
}