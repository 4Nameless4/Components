"use strict";
import style from "./App.module.css";
import { RouterLink, RouterView, useRouter } from "./react-router";
import readme from "../README.md";
import { useState } from "react";
import GraphSVG from "./graph/svg";
import Test from "./test";

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

  const [node, setNode] = useState<{ id: string }[]>([]);
  const [link, setLink] = useState<{ source: string; target: string }[]>([]);
  const [styles, setStyle] = useState<{ fill?: string; r?: number }>({});
  const [styles2, setStyle2] = useState<{ color?: string }>({});
  const [pos, setPos] = useState<Record<string, { x: number; y: number }>>({});

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
          <button
            onClick={() => {
              setNode([{ id: "1" }, { id: "2" }]);
              console.warn("click");
            }}
          >
            data change
          </button>
          <button
            onClick={() => {
              setLink([{ source: "1", target: "2" }]);
              console.warn("click");
            }}
          >
            link data change
          </button>
          <button
            onClick={() => {
              setStyle({ fill: "red", r: 50 });
              console.warn("click");
            }}
          >
            style change
          </button>
          <button
            onClick={() => {
              setStyle2({ color: "blue" });
              console.warn("click");
            }}
          >
            style change
          </button>
          <button
            onClick={() => {
              setPos({ "1": { x: 500, y: 300 } });
              console.warn("click");
            }}
          >
            pos change
          </button>
          <GraphSVG
            nodes={node}
            links={link}
            nodeStyle={styles}
            linkStyle={styles2}
            positions={pos}
          ></GraphSVG>
          <RouterView>
            <article dangerouslySetInnerHTML={{ __html: readme }}></article>
          </RouterView>
        </main>
      </div>
      <footer></footer>
    </>
  );
}
