import Head from "next/head";
import Nav from "../src/modules/Nav";

export default function App() {
  return (
    <div>
      <Head>
        <title>Typeahead</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
    </div>
  );
}
