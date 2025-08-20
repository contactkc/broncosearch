import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from "next/head";
import { Roboto_Mono } from 'next/font/google'
import { ThemeProvider } from "next-themes";

const robotoMono = Roboto_Mono({
  weight: '400',
  subsets: ['latin']
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider attribute="class">
            <Head>
                <title>broncosearch</title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
                    rel="stylesheet">
                </link>
                <meta name="description" content="discover cpp courses using natural language" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className={robotoMono.className}>
                <Component {...pageProps} />
            </div>
        </ThemeProvider>
    );
}

export default MyApp;