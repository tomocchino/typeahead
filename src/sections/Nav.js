import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../styles/Nav.module.css";

let pages = ["emoji", "actors"];

export default function Nav() {
  let router = useRouter();
  let currentPath = router.pathname.slice(1);
  let links = pages.map((path) => {
    let className = currentPath === path ? styles.Selected : "";
    return (
      <li key={path}>
        <Link href={"/" + path}>
          <a className={className}>{path}</a>
        </Link>
      </li>
    );
  });

  return (
    <nav className={styles.Nav}>
      <ul>{links}</ul>
    </nav>
  );
}
