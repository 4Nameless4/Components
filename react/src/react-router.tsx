import { createContext, useContext } from "react";
import { createRouter, t_router, t_routes } from "./router";

const routerContext = createContext<t_router>(createRouter({}));

export function useRouter(): t_router {
  return useContext(routerContext);
}

export function Router(props: { routes: t_routes; children: JSX.Element }) {
  return (
    <routerContext.Provider value={createRouter(props.routes)}>
      {props.children}
    </routerContext.Provider>
  );
}

export function RouterView(props: { children?: JSX.Element } = {}) {
  const router = useRouter();
  const route = router.matched();
  return <>{(route && route.page) || props.children}</>;
}

export function RouterLink(props: {
  href: string;
  children?: JSX.Element | string;
}) {
  const router = useRouter();
  return (
    <a
      href={props.href}
      onClick={(e) => {
        e.preventDefault();
        router.push(props.href);
      }}
    >
      {props.children}
    </a>
  );
}
