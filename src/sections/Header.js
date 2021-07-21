import Head from "next/head";
import Nav from "./Nav";

export default function Header(props) {
  return (
    <div>
      <Head>
        <title>{props.title || "Typeahead"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
    </div>
  );
}
