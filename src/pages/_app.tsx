import Head from "next/head";

import "/styles/globals.css";
import "/src/main/Typeahead.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Typeahead</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
