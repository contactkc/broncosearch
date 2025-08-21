import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from "next/head";
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ThemeProvider } from "next-themes";
import { useEffect } from 'react';
import { Analytics } from "@vercel/analytics/next"


function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        const initSmoothScrolling = async () => {
            const Lenis = (await import('lenis')).default;
            
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });

            function raf(time: number) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            
            return () => {
                lenis.destroy();
            };
        };

        const cleanup = initSmoothScrolling();
        
        return () => {
            cleanup.then(cleanupFn => cleanupFn?.());
        };
    }, []);

    return (
        <ThemeProvider attribute="class">
            <Head>
                <title>broncosearch</title>
                <meta name="description" content="discover cpp courses using natural language" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div>
                <Navbar />
                <Component {...pageProps} />
            </div>
            <Footer />
            <Analytics />
        </ThemeProvider>
    );
}

export default MyApp;