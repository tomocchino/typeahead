import { AppProps } from "next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Head from "next/head";

import "../styles/globals.css";
import "../src/css/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Typeahead</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SpeedInsights />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
