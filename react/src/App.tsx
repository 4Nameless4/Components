"use strict";
import style from "./App.module.css";
import { RouterLink, RouterView, useRouter } from "./react-router";
import readme from "../README.md";
import GraphDemo from "./graph/demo";

export default function App() {
  const router = useRouter();

  const list: JSX.Element[] = [];
  for (const path in router.routes) {
    const route = router.routes[path];
    list.push(
      <li key={path}>
        <RouterLink href={path}>{route.name}</RouterLink>
      </li>
    );
  }

  return (
    <>
      <header></header>
      <div className={style.content}>
        <aside>
          <nav>
            <ul>{list}</ul>
          </nav>
        </aside>
        <main className={style.main}>
          <GraphDemo></GraphDemo>
          <RouterView>
            <article dangerouslySetInnerHTML={{ __html: readme }}></article>
          </RouterView>
        </main>
      </div>
      <footer></footer>
    </>
  );
}
