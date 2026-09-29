import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
type RouteState = { path: string; restoreY: number | null; id: number };
const RouterContext = createContext<{
  pathname: string;
  state: RouteState;
  navigate: (to: string) => void;
} | null>(null);
const currentPath = () =>
  window.location.pathname + window.location.search + window.location.hash;
export function RouterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RouteState>(() => ({
    path: currentPath(),
    restoreY: null,
    id: 0,
  }));
  useEffect(() => {
    history.scrollRestoration = "manual";
    let lastPopPath: string | null = null;
    const pop = (e: PopStateEvent) => {
      lastPopPath = currentPath();
      setState((s) => ({
        path: currentPath(),
        restoreY: typeof e.state?.scrollY === "number" ? e.state.scrollY : null,
        id: s.id + 1,
      }));
    };
    const hash = () => {
      if (lastPopPath === currentPath()) {
        lastPopPath = null;
        return;
      }
      setState((s) => ({ path: currentPath(), restoreY: null, id: s.id + 1 }));
    };
    window.addEventListener("popstate", pop);
    window.addEventListener("hashchange", hash);
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("hashchange", hash);
    };
  }, []);
  const navigate = useCallback((to: string) => {
    const target = new URL(to, location.origin);
    history.replaceState({ ...history.state, scrollY: window.scrollY }, "");
    if (currentPath() !== target.pathname + target.search + target.hash)
      history.pushState({ scrollY: 0 }, "", to);
    setState((s) => ({ path: currentPath(), restoreY: null, id: s.id + 1 }));
  }, []);
  const value = useMemo(
    () => ({ pathname: state.path.split(/[?#]/)[0] || "/", state, navigate }),
    [state, navigate],
  );
  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}
export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("RouterProvider required");
  return context;
}
export function AppLink({
  href,
  children,
  className,
  ariaLabel,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}) {
  const { navigate, pathname } = useRouter();
  function click(e: MouseEvent<HTMLAnchorElement>) {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    if (new URL(href, location.origin).origin !== location.origin) return;
    e.preventDefault();
    onClick?.();
    navigate(href);
  }
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      aria-current={href === pathname ? "page" : undefined}
      onClick={click}
    >
      {children}
    </a>
  );
}
