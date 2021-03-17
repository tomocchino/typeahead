import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Typeahead</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <input className={styles.input} />
    </div>
  );
}
