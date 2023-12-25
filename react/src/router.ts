export interface t_route {
  name?: string;
  page: JSX.Element | (() => JSX.Element);
  children?: t_routes;
}

export interface t_router {
  getPath: () => string[];
  matched: () => t_route | null;
  search: () => URLSearchParams;
  push: (path: string) => void;
  replace: (path: string) => void;
  routes: t_routes;
}

export type t_routes = Record<string, t_route>;

function getPath() {
  const pathname = window.location.pathname.replace(/^\//, "");
  const pathArr = pathname.split("/");
  return pathArr;
}
function getMatched(path: string[], routes: t_routes, arr: t_route[] = []) {
  const r = routes[path[0]];
  if (r) {
    arr.push(r);
    const nextPath = path.slice(1);
    const nextChildren = r.children;
    if (nextPath && nextPath.length && nextChildren) {
      getMatched(nextPath, nextChildren, arr);
    }
  }
  return arr;
}
function getSearch() {
  return new URLSearchParams(document.location.search.substring(1));
}

export function createRouter(routes: t_routes): t_router {
  const router: t_router = {
    getPath,
    matched() {
      const path = getPath();
      if (!path.length || (path.length === 1 && path[0] === "")) {
        return routes["/"];
      }

      const arr = getMatched(path, routes);

      if (!arr.length) {
        return null;
      }

      return arr[arr.length - 1];
    },
    search() {
      return getSearch();
    },
    push(path: string) {
      history.pushState({}, "", path);
    },
    replace(path: string) {
      history.replaceState({}, "", path);
    },
    routes,
  };
  return router;
}
